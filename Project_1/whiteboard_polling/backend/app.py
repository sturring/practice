from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from config import ROOM_ID, FILTERS
from cpp_module.filter import apply_filter_cpp

app = FastAPI()

# Внутрішній буфер команд
_store = []

# Додай CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001", "http://127.0.0.1:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/draw/{room_id}")
async def draw(room_id: str, command: dict):
    if room_id != ROOM_ID:
        raise HTTPException(status_code=404, detail="Room not found")
    _store.append(command)
    return {"status": "ok"}

@app.get("/draw/{room_id}")
async def get_draw(room_id: str):
    if room_id != ROOM_ID:
        raise HTTPException(status_code=404, detail="Room not found")
    return _store

@app.post("/filter/{room_id}")
async def filter_image(room_id: str, payload: dict):
    if room_id != ROOM_ID:
        raise HTTPException(status_code=404, detail="Room not found")

    try:
        data = payload["image_data"]           # список чисел (RGBA)
        width = int(payload["width"])
        height = int(payload["height"])
        filter_name = payload["filter_name"]
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {e}")

    # Виклик C++-модуля
    filtered = apply_filter_cpp(data, width, height, filter_name)

    return {"image_data": filtered}
