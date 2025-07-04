from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routers
app.include_router(tts.router)