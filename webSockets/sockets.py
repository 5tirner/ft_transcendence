import websockets
import asyncio

async def handler(websocket, path):
    data = await websocket.recv()