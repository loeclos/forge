from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from uuid import uuid4
from pydantic import BaseModel
from services.ollama_services import check_ollama_running
from services.agno_services import create_agent
import asyncio
import json


router = APIRouter()


tool_requiring_confirm = None


# Request models
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    stream: bool = False

class ConfirmToolRequest(BaseModel):
    tool_id: str
    session_id: str
    confirmed: bool



@router.post("/confirm-tool")
def confirm_tool(request: ConfirmToolRequest):
    pass
    
@router.post("/")
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
                    if chunk.is_paused:
                        for tool in chunk.tools_requiring_confirmation:
                            tool_id = uuid4()
                            tool_requiring_confirm = {
                                "tool_name": tool.tool_name,
                                "tool_id": f"{tool_id}",
                                "session_id": session_id,
                                "confirmed": tool.confirmed,
                            }
                    else:
                        tool_requiring_confirm = None

                    chunk_data = {
                        "content": chunk.content or "",
                        "type": type(chunk).__name__,
                        "tool_calls": [tc.model_dump() for tc in getattr(chunk, "tool_calls", [])],
                        "session_id": session_id,
                        "tool_requiring_confirmation": tool_requiring_confirm
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
