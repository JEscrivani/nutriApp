from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from models import Users, UserRole, Gender
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt
from datetime import date, datetime, timezone, timedelta
import os
from dotenv import load_dotenv

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

# RECURSOS DE BANCO DE DADOS
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

#RECURSOS DE GRAVAÇÃO DO CLIENTE
class CreateUserRequest(BaseModel):
    name: str = Field()
    email: str = Field()
    cpf: str = Field()
    password: str = Field(min_length=6)
    role: UserRole = Field()
    birthday: date = Field()
    gender: Gender = Field()

# RECURSOS PARA VALIDAÇÃO DO USUARIO
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

bcrypt_context = CryptContext(schemes=["bcrypt"])
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/login')

def authenticate_user(cpf: str, password: str, db):
    user = db.query(Users).filter(Users.cpf == cpf).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password):
        return False
    return user

def create_jwt(id: int, role: str, expires_delta: timedelta):
    encode = {
        'id': id,
        'role': role,
        'exp': datetime.now(timezone.utc) + expires_delta
    }
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(request: Request):
    token = request.cookies.get('token')
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='ERRO ao validar usuário.')

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get('id')
        user_role = payload.get('role')
        if user_id is None or user_role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='ERRO ao validar usuário.')
        return {'user_id': user_id, 'user_role': user_role}
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='ERRO ao validar usuário.')
user_dependency = Annotated[dict, Depends(get_current_user)]

# ROTAS
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, request: CreateUserRequest):
    user = Users(
        name=request.name,
        email=request.email,
        cpf=request.cpf,
        password=bcrypt_context.hash(request.password),
        role=request.role,
        birthday=request.birthday,
        gender=request.gender
    )
    db.add(user)
    db.commit()

@router.post('/login', status_code=status.HTTP_204_NO_CONTENT)
async def login(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='CPF ou senha inválido.')
    
    token = create_jwt(user.id, user.role, timedelta(minutes=60))

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax"
    )

@router.delete('/logout', status_code=status.HTTP_204_NO_CONTENT)
async def login(response: Response):
    response.delete_cookie("token")

@router.get('/validate', status_code=status.HTTP_200_OK)
async def validate(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='ERRO ao validar usuário.')
    
    return {
        'id': user.get('user_id'),
        'role': user.get('user_role')
    }