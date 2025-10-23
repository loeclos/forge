import asyncio
import json
from typing import Annotated, Literal
from uuid import uuid4
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlmodel import Field, Session, SQLModel, create_engine, select
from services.models_service import ModelsService
import ollama
from contextlib import asynccontextmanager
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.db.sqlite import SqliteDb
from core.config import settings
from pydantic import BaseModel
import os
from tavily import TavilyClient
from dotenv import load_dotenv


class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)


class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

class HeroCreate(HeroBase):
    secret_name: str

class HeroUpdate(HeroBase):
    name: str | None = None
    age: int | None = None
    secret_name: str | None = None

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    stream: bool = False

class ChangeModelInfo(BaseModel):
    model_name: str

load_dotenv()

sqlite_file_name = "./db/database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

client = TavilyClient(os.getenv('TAVILY_API_KEY'))
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

def download_model(model_name: str):
    for progress in ollama.pull(model_name, stream=True):
        # yield {'completed': progress.completed, 'total': progress.total}
        data = json.dumps({'completed': progress.completed, 'total': progress.total})
        yield f"data: {data}\n\n"

def is_path_in_current_script_dir(target_path):
    """
    Checks if a given path is within the same directory as the current Python script.

    Args:
        target_path (str): The path to check.

    Returns:
        bool: True if the target_path is in the same directory, False otherwise.
    """
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    absolute_target_path = os.path.abspath(target_path)
    target_parent_dir = os.path.dirname(absolute_target_path)

    return current_script_dir == target_parent_dir

def write_file(filename: str, value: str = '', write_type: Literal['w', 'a', 'x', 'wt'] = 'wt'):
    if not is_path_in_current_script_dir(filename):
        raise RuntimeError('Cannot write to files that are not in the current directory.')
    with open(file=filename, mode = write_type) as file:
        file.write(value)
    pass


def search_internet(query):
    '''
    A function that searches the internet and returns mulitple urls.

    Params: 
        query - string
    
    Returns:
        A JSON object. An example return:
        ```json
            {
                "query": YOUR QUERY
                "results": [
                    {
                        "url": "https://example.com",
                        "title": "Something something something",
                        "content": "We talk about something here..." 
                        "score": 0.79,
                        "raw_content": "The website scraped" | null
                    },
                    ...
                ]
            }
        ```

        Explanation of fields inside the `results`:
            `url`: The url of the website that was returned in the search
            `title`: The title of the website.
            `content`: A quick overview of the content inside the website.
            `score`: The probability that the website is relevant to the query.
            `raw_content`: The website scraped more thoroughly. This is usually more detailed than the `content` field. Use this field to get detailed and relevant answers.

        You will go over the `results` array and look through all of the `title` and `content`. You will then choose 2-3 websites from the results and dive more deeply into the `raw_content`, if it exsists.
    '''
    response = client.search(query=query, include_raw_content="text")

    return response

agent_instructions = '''
    ### Define goals and constraints
    - Start by restating the task, scope, success criteria, inputs, outputs, policies, and non-goals to remove ambiguity and align actions with project standards.[3][8]
    - Load and follow existing engineering guidelines, runbooks, or technology-specific conventions so generated code matches the team’s expectations and repository norms.[5][8]
    - Prefer using project-approved patterns and reference documents over inventing new ones, and flag any missing standards or contradictions for review.[8][5]

    ### Plan before acting
    - Propose a brief plan with assumptions, risks, and checkpoints before invoking tools, and request confirmation only when the risk of misalignment is high.[7][1]
    - Decompose work into small, verifiable steps to reduce error surface and enable frequent course corrections via tool feedback or tests.[3][7]
    - Use chained prompting for complex tasks to keep context focused, confirm progress, and prevent drift or overreach.[1][7]

    ### Choose and validate tools
    - Select the minimal set of tools that can accomplish the subtask, noting each tool’s capability boundaries, required permissions, and expected inputs/outputs.[8][1]
    - When uncertain, perform a dry-run or describe the intended action and validation criteria before execution to confirm safety and correctness.[1][8]
    - Validate preconditions (auth, environment, file paths, network access) and state explicit postconditions that will be checked after the tool runs.[8][1]

    ### Retrieval and search discipline
    - Use concise, targeted queries; prefer iterative refinement over broad, one-shot searches, and summarize findings with clear citations and open questions.[7][8]
    - Stop early when information suffices and avoid redundant queries that do not change decision-making, documenting why further search is unnecessary.[7][8]
    - If sources conflict, list the contradictions, the chosen resolution, and any residual uncertainty requiring human review.[7][8]

    ### Execute with a tight feedback loop
    - Take small actions, read tool output carefully, and adjust the plan based on explicit signals like errors, diffs, logs, and tests.[1][7]
    - If stuck in an error loop, reset context, reframe the plan, or try an alternative approach to avoid compounding mistakes.[1][7]
    - Keep changes minimal and reversible until confidence increases through passing checks and clear validation signals.[7][1]

    ### Testing, linting, and CI
    - Prefer code paths that are covered by tests; when missing, add targeted unit/integration tests before or alongside changes to create a safety net.[2][7]
    - Run type-checkers, linters, and tests early and often, iterating on failures until the feedback loop is quiet and green.[2][1]
    - Ensure CI scripts and local commands are documented and runnable, noting any environment setup steps the agent executed or requires.[2][8]

    ### Error handling and recovery
    - Fail fast with clear, actionable error messages; log context and choose precise exception types to aid debugging and triage.[6][2]
    - Apply pragmatic retries with jittered backoff only for transient errors, and surface persistent failures promptly with a concise incident note.[6][2]
    - Prefer explicit validation and guardrails over silent coercion so issues are caught near their source.[6][2]

    ### Security and privacy
    - Never print or exfiltrate secrets; use sanctioned secrets management and environment variables, and minimize data access and retention.[5][8]
    - Request only the least privileges necessary for a tool call, and document why elevated access is needed when required.[5][8]
    - Use only platform-approved tool servers and integrations, given known vulnerabilities in some agent toolchain protocols reported by third parties.[8][7]

    ### State and context management
    - Keep a running decision log capturing assumptions, rationale, and links to standards used, so work remains transparent and reproducible.[5][8]
    - Update or consult the repository’s coding-guidelines file so new code stays aligned with language- and framework-specific norms.[5][1]
    - Note open threads and next actions to support smooth handoff or future iterations without context loss.[8][5]

    ### Performance, cost, and parallelization
    - Prefer batching and deduplication when safe, and avoid unnecessary calls; surface estimated cost/latency when relevant to trade-off decisions.[7][8]
    - Parallelize only independent steps; sequence dependent ones and checkpoint between them to contain blast radius.[1][8]
    - Watch for rate limits and model/tool instability; switch strategies or models when blocked and document the reason and outcome.[8][7]

    ### Observability and reproducibility
    - Log tool inputs/outputs at an appropriate privacy level, with versions, timestamps, and seeds when applicable for reproducibility.[2][8]
    - Pin dependencies and record environment setup to ensure future runs match current behavior, especially in CI.[2][8]
    - Produce minimal diffs and a clear summary of changes, tests run, and validation evidence.[2][8]

    ### Handoff and human-in-the-loop
    - Proactively flag uncertainties, deviations from standards, and trade-offs, and request targeted reviews where human expertise is essential.[1][2]
    - Provide a short PR description linking to guidelines followed, test artifacts, and any residual risks that need sign-off.[5][2]
    - Treat human oversight as a reliability feature, not a failure; integrate feedback and close the loop with updated documentation.[2][1]

    ### Quick checklist
    - Goal, constraints, and standards loaded.[8]
    - Plan, assumptions, and risks listed.[7]
    - Minimal tools chosen; pre/postconditions defined.[8]
    - Small step executed; outputs read and acted upon.[1]
    - Tests, types, and lint are green.[2]
    - Secrets protected; least privilege used.[5]
    - Logs, versions, and diffs recorded.[8]
    - Review requested with clear evidence.[2]
'''

def create_agent(session_id: str) -> Agent:
    return Agent(
        model=Ollama(id=settings.MODEL),  # Replace with your model
        session_id=session_id,
        tools=[search_internet],
        db=SqliteDb(db_file="./db/chat_history.db"),  # Persistent storage
        add_history_to_context=True,  # Include past messages in context
        num_history_runs=5,  # Limit history to last 5 interactions
        instructions=agent_instructions
    )



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI(lifespan=lifespan)

def check_ollama_running():
    try: 
        ollama.ps()
        return True
    except ConnectionError:
        return False

@app.get('/models/')
def get_available_models():
    try:
        models = ModelsService.get_models()
    except ConnectionError:
        raise HTTPException(status_code=500, detail='Ollama either not installed or not running.')
    else:
        return models

@app.post('/models/download/{model_name}')
def download_new_model(model_name: str):
    try:
        return StreamingResponse(
        download_model(model_name),
        media_type="application/json"  
    )
        
    except ollama.ResponseError:
        raise HTTPException(status_code=500, detail='The model you tried to download does not exist.')

@app.get('/models/current')
def get_current_model():
    return {'model': settings.MODEL}

@app.post('/models/change')
def change_current_model(new_model: ChangeModelInfo):
    for model_info in get_available_models():
        print(model_info)
        if model_info['name'] == new_model.model_name:
            settings.MODEL = new_model.model_name
            return {'message': f'Success! model set to {settings.MODEL}'}
        else:
            continue
    return HTTPException(status_code=404, detail='The model yoiu are trying to set as default does not exist. Maybe try downloading it?')

@app.post("/heroes/", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: SessionDep):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero



@app.post("/chat")
async def chat(request: ChatRequest):

    # Generate a session_id if not provided

    session_id = request.session_id or f"session_{hash(str(asyncio.get_event_loop().time()))}"
    
    # Create agent for this session
    agent = create_agent(session_id)
    
    try:
        if not check_ollama_running():
            raise HTTPException(status_code=500, detail="Ollama either not installed or not running.")
        if not request.stream:
            # Non-streaming mode: Return full response
            response = await agent.arun(request.message, stream=False)
            return {
                "response": response.content,
                "session_id": session_id
            }
        
        # Streaming mode: Yield chunks as SSE
        async def stream_generator():
            try:
                # Iterate over streamed RunResponse chunks
                async for chunk in agent.arun(request.message, stream=True):
                    chunk_data = {
                        "content": chunk.content or "",
                        "type": type(chunk).__name__,
                        "tool_calls": [tc.model_dump() for tc in getattr(chunk, "tool_calls", [])],
                        "session_id": session_id
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e), 'session_id': session_id})}\n\n"

        return StreamingResponse(
            stream_generator(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
        )
    
    except ConnectionError:
        raise HTTPException(status_code=500, detail="Ollama either not installed or not running.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get('/utils/getcwd')
def get_current_folder():
    try:
        return {'dir': os.getcwd()}
    except Exception as e:
        return {'message': e}

@app.get("/heroes/", response_model=list[HeroPublic])
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes


@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: SessionDep) -> Hero:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    hero_db = session.get(Hero, hero_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = hero.model_dump(exclude_unset=True)
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db

@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}