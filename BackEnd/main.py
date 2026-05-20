from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from database import engine
import models

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app = FastAPI()
app.include_router(auth.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/teste")
async def teste_rota():
    return {'message': 'ok'}

models.Base.metadata.create_all(bind=engine)