from turtle import clone
from fastapi import FastAPI
from services.service import router 
app = FastAPI()


app.include_router(router, prefix="/repository", tags=["repository"])

@app.get("/")
def home():
    return {
        "message": "Repository Worker Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }