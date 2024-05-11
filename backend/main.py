# run with: 
# source path/to/venv/bin/activate
# uvicorn main:app --reload
from typing import Union

import functions as f
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows CORS for your Next.js app on this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/{pattern_number}/{generations_number}")
def get_generations(pattern_number: int, generations_number: int):
    generations = f.calculate_generations(f.get_initial_generation(generations_number), f.get_patterns(pattern_number), generations_number)
    return {"generations": generations}