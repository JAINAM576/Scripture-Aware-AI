"""
Christianity AI Assistant — FastAPI entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.chat import router as chat_router
from routes.image import router as image_router

app = FastAPI(
    title="Christianity AI Assistant",
    description="A warm, knowledgeable Christian AI assistant with grounded scripture and denomination awareness.",
    version="1.0.0",
)

# Allow all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(image_router, prefix="/api")


@app.get("/")
def health():
    return {"status": "ok", "service": "Christianity AI Assistant"}
