from database import Base
from sqlalchemy import Column, Integer, String, Date, Boolean, Enum as SQLEnum
from enum import Enum

class UserRole(str, Enum):
    NUTRICIONISTA = "nutricionista"
    CLIENTE = "cliente"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    cpf = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(SQLEnum(UserRole), nullable=False)
    birthday = Column(Date)
    gender = Column(SQLEnum(Gender), nullable=False)