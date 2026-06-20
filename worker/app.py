from turtle import clone
from fastapi import FastAPI
from services.initializeRepo.service import router as repository_router
from services.analysis.analysis_router import router as analysis_router
from services.semantic_search.semantic_search_router import router as semantic_search_router
app = FastAPI()


app.include_router(repository_router, prefix="/repository", tags=["repository"])
app.include_router(analysis_router, prefix="/repo-analysis", tags=["analysis"])
app.include_router(semantic_search_router, prefix="/semantic-search", tags=["semantic-search"])

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