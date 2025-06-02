from fastapi import FastAPI, HTTPException
from config import ROOM_ID, FILTERS
from cpp_module.filter import apply_filter_cpp
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8001"],  # або ["*"], щоб дозволити всі походження
    allow_methods=["*"],
    allow_headers=["*"],
)
_store = []

@app.post("/draw/{room_id}")
def draw(room_id: str, command: dict):
    if room_id != ROOM_ID:
        raise HTTPException(status_code=404, detail="Room not found")
    _store.append(command)
    return {"status": "ok"}

@app.get("/draw/{room_id}")
def get_draw(room_id: str):
    if room_id != ROOM_ID:
        raise HTTPException(status_code=404, detail="Room not found")
    return _store

@app.post("/filter/{room_id}")
def filter_image(room_id: str, payload: dict):
    if room_id != ROOM_ID:
        raise HTTPException(status_code=404, detail="Room not found")
    filtered = apply_filter_cpp(data, width, height, payload["filter_name"])
    # echo stub
    return {"image_data": data}
