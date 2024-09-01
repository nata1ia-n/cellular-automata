# Elementary Cellular Automata Visualiser

<img width="1488" alt="Screenshot 2024-09-01 at 15 47 10" src="https://github.com/user-attachments/assets/c145a9cd-1cfb-4754-9d53-7cc42ecb3bed">

## Project description

A Next.js web application (front-end) for generating elementary cellular automata patterns, paired with a Python-based API (back-end) built using FastAPI. The app allows users to input parameters such as pattern number, generations number, and initial generation type, enabling them to visualize various configurations.

## Running the app

### Backend

- Navigate to the `backend` folder
- Activate the poetry environment: `poetry shell`
- Install dependecies: `poetry install`
- Run the backend: `uvicorn main:app --reload` or simply `make run`

### Frontend

- Navigate to the `frontend` folder
- Install dependencies: `npm i`
- Run the frontend: `npm run dev` or simply `make run`
