from fastapi import APIRouter, Depends, status, HTTPException
from datetime import date
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated
from .auth import get_current_user
from models import Users, Gender
from pydantic import BaseModel

router = APIRouter(
    prefix='/clients',
    tags=['clients']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class ClientResponse(BaseModel):
    id: int
    name: str
    birthday: date
    gender: Gender

@router.get('/', status_code=status.HTTP_200_OK, response_model=list[ClientResponse])
async def get_all_clients(db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário inválido.")
    if user.get("user_role") != "nutricionista":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuário sem permissão.")
    
    return db.query(Users).filter(Users.role == "cliente").all()