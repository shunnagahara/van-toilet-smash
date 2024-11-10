# app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": 'aaa'}

@app.get("/test/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": 'aaa'}

@app.get("/test2/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": 'aaa'}
