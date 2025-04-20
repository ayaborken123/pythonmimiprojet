from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from pydantic_core import core_schema
import json

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)

class Etudiant(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    nom: str
    prenom: str
    age: int
    email: str
    departement_id: str
    formations_inscrites: List[str]
    photo_url: Optional[str] = None

    @field_validator('formations_inscrites', mode='before')
    def parse_formations(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v.replace("'", '"'))
            except json.JSONDecodeError:
                return v.split(',')
        return v

class Departement(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    nom: str
    description: str
    responsable: str
    email: str
    telephone: str
    nombre_etudiants: int  # Changé de str à int
    date_creation: str
    batiment: str
    active: bool  # Changé de str à bool
    formations_ids: List[PyObjectId] = []

    @field_validator('nombre_etudiants', 'active', mode='before')
    def convert_types(cls, v):
        if isinstance(v, str):
            if v.isdigit():  # Pour nombre_etudiants
                return int(v)
            elif v.lower() in ['true', 'false']:  # Pour active
                return v.lower() == 'true'
        return v

    @field_validator('formations_ids', mode='before')
    def parse_formations_ids(cls, v):
        if isinstance(v, str):
            try:
                return [PyObjectId(id.strip()) for id in v.strip('[]').split(',') if id.strip()]
            except:
                return []
        return v or []  
class Formation(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    titre: str
    description: Optional[str] = ""

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )