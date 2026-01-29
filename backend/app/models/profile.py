from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, info=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class Education(BaseModel):
    degree: str
    institution: str
    year: str
    description: Optional[str] = None


class Project(BaseModel):
    title: str
    description: str
    links: list[str] = []
    skills: list[str] = []


class WorkExperience(BaseModel):
    title: str
    company: str
    duration: str
    description: Optional[str] = None


class Links(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None


class ProfileBase(BaseModel):
    name: str
    email: EmailStr
    education: list[Education] = []
    skills: list[str] = []
    projects: list[Project] = []
    work: list[WorkExperience] = []
    links: Links = Links()


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    education: Optional[list[Education]] = None
    skills: Optional[list[str]] = None
    projects: Optional[list[Project]] = None
    work: Optional[list[WorkExperience]] = None
    links: Optional[Links] = None


class Profile(ProfileBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class ProfileResponse(ProfileBase):
    id: str

    class Config:
        populate_by_name = True
