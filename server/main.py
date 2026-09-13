from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.search_ai import router as search_router

app = FastAPI(title="Googlen't API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search_router)

@app.get("/health")
def health_check():
    return {"status": "running"}
