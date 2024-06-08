# run with: 
# poetry shell
# uvicorn main:app --reload

import automata.calculate as calc
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
    generations = calc.generations(calc.initial_generation(generations_number), calc.patterns(pattern_number), generations_number)
    return {"generations": generations}

@app.get("/{pattern_number}")
def get_rules(pattern_number: int):
    rules = calc.patterns(pattern_number)
    return {"rules": rules}