from database import Base
from sqlalchemy import Column, Integer, String, Date, Boolean, Enum as SQLEnum, Numeric, ForeignKey
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
    cellphone = Column(String, unique=True)
    password = Column(String)
    role = Column(SQLEnum(UserRole), nullable=False)
    birthday = Column(Date)
    gender = Column(SQLEnum(Gender), nullable=False)
    active = Column(Boolean, nullable=False)
    created_at = Column(Date, nullable=False)

class Measures(Base):
    __tablename__ = 'measures'
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    measured_at = Column(Date, nullable=False)
    triciptal_skinfold = Column(Numeric(5, 1))
    subscapular_skinfold = Column(Numeric(5, 1))
    chest_skinfold = Column(Numeric(5, 1))
    midaxillary_skinfold = Column(Numeric(5, 1))
    abdominal_skinfold = Column(Numeric(5, 1))
    suprailiac_skinfold = Column(Numeric(5, 1))
    thigh_skinfold = Column(Numeric(5, 1))
    waist_circumference = Column(Numeric(5, 1))
    abdomen_circumference = Column(Numeric(5, 1))
    arm_circumference = Column(Numeric(5, 1))
    forearm_circumference = Column(Numeric(5, 1))
    chest_circumference = Column(Numeric(5, 1))
    hip_circumference = Column(Numeric(5, 1))
    calf_circumference = Column(Numeric(5, 1))
    thigh_circumference = Column(Numeric(5, 1))
