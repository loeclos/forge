from fastapi import APIRouter, HTTPException, WebSocket
from fastapi.responses import StreamingResponse

from uuid import uuid4
from pydantic import BaseModel, ValidationError
from app.services.ollama_services import check_ollama_running
from app.services.agno_services import create_agent
import asyncio
import json


router = APIRouter()


tool_requiring_confirm = None


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(json.dumps(message))

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

# Request models
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

class ConfirmToolRequest(BaseModel):
    tool_id: str
    session_id: str
    confirmed: bool


@router.websocket("/ws")
async def chat(websocket: WebSocket):
    manager = ConnectionManager()
    await manager.connect(websocket)

    while True:
        data = await websocket.receive_json()
        if data['type'] == 'chat_message':
            # Generate a session_id if not provided
            session_id = data.content.session_id or f"session_{hash(str(asyncio.get_event_loop().time()))}"

            # Create agent for this session
            agent = create_agent(session_id)

            try:
                if not check_ollama_running():
                    raise HTTPException(status_code=500, detail="Ollama either not installed or not running.")
                try:
                    message_id = uuid4()
                    async for chunk in agent.arun(data['content']['message'], stream=True):
                        if chunk.is_paused:
                            for tool in chunk.tools_requiring_confirmation:
                                tool_id = uuid4()
                                tool_requiring_confirmation = {
                                    "tool_name": tool.tool_name,
                                    "tool_id": f"{tool_id}",
                                    "session_id": session_id,
                                    "confirmed": tool.confirmed,
                                }
                                manager.send_json(
                                    {
                                        "type": "confirm_tool",
                                        "content": tool_requiring_confirm,
                                }, websocket)
                        chunk_data = {
                            "type": "chat_response",
                            "content": {
                                "user_query" : data['content']['message']
                                "id": message_id,
                                "content": chunk.content or "", 
                                "type": type(chunk).__name__,
                                "tool_calls": [tc.model_dump() for tc in getattr(chunk, "tool_calls", [])],
                                "session_id": session_id,
                            }
                        }
                        manager.send_json(chunk_data, websocket) 
                except Exception as e:
                    manager.send_json({'error': str(e), 'session_id': session_id})
            except ConnectionError:
                return HTTPException(status_code=500, detail="Ollama either not installed or not running.")
            except Exception as e:
                return HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.post("/confirm-tool")
def confirm_tool(request: ConfirmToolRequest):
    pass
#
# @router.post("/")
# async def chat(request: ChatRequest):
#
#     # Generate a session_id if not provided
#
#     session_id = request.session_id or f"session_{hash(str(asyncio.get_event_loop().time()))}"
#
#     # Create agent for this session
#     agent = create_agent(session_id)
#
#     try:
#         if not check_ollama_running():
#             raise HTTPException(status_code=500, detail="Ollama either not installed or not running.")
#         if not request.stream:
#             # Non-streaming mode: Return full response
#             response = await agent.arun(request.message, stream=False)
#             return {
#                 "response": response.content,
#                 "session_id": session_id
#             }
#
#         # Streaming mode: Yield chunks as SSE
#         async def stream_generator():
#             try:
#                 # Iterate over streamed RunResponse chunks
#                 async for chunk in agent.arun(request.message, stream=True):
#                     if chunk.is_paused:
#                         for tool in chunk.tools_requiring_confirmation:
#                             tool_id = uuid4()
#                             tool_requiring_confirm = {
#                                 "tool_name": tool.tool_name,
#                                 "tool_id": f"{tool_id}",
#                                 "session_id": session_id,
#                                 "confirmed": tool.confirmed,
#                             }
#                     else:
#                         tool_requiring_confirm = None
#
#                     chunk_data = {
#                         "content": chunk.content or "",
#                         "type": type(chunk).__name__,
#                         "tool_calls": [tc.model_dump() for tc in getattr(chunk, "tool_calls", [])],
#                         "session_id": session_id,
#                         "tool_requiring_confirmation": tool_requiring_confirm
#                     }
#
#                     yield f"data: {json.dumps(chunk_data)}\n\n" 
#                 yield "data: [DONE]\n\n"
#             except Exception as e:
#                 yield f"data: {json.dumps({'error': str(e), 'session_id': session_id})}\n\n"
#
#         return StreamingResponse(
#             stream_generator(),
#             media_type="text/event-stream",
#             headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
#         )
#
#     except ConnectionError:
#         raise HTTPException(status_code=500, detail="Ollama either not installed or not running.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
#

