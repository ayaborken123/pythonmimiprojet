from fastapi import APIRouter, HTTPException
from models.schemas import Etudiant
from database.connection import etudiants_collection
from typing import List
import json

router = APIRouter()

@router.post("/", response_model=Etudiant)
async def ajouter_etudiant(etudiant: Etudiant):
    try:
        etudiant_dict = etudiant.model_dump(by_alias=True, exclude={"id"})
        
        # S'assurer que formations_inscrites est bien une liste
        if isinstance(etudiant_dict.get("formations_inscrites"), str):
            etudiant_dict["formations_inscrites"] = json.loads(
                etudiant_dict["formations_inscrites"].replace("'", '"')
            )
        
        result = await etudiants_collection.insert_one(etudiant_dict)
        etudiant_dict["_id"] = str(result.inserted_id)
        return etudiant_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Etudiant])
async def get_etudiants():
    try:
        etudiants = []
        async for document in etudiants_collection.find():
            # Convertir ObjectId en string
            document["_id"] = str(document["_id"])
            
            # Assurer que formations_inscrites est une liste
            if isinstance(document.get("formations_inscrites"), str):
                try:
                    document["formations_inscrites"] = json.loads(
                        document["formations_inscrites"].replace("'", '"')
                    )
                except json.JSONDecodeError:
                    document["formations_inscrites"] = document["formations_inscrites"].split(',')
            
            etudiants.append(document)
        return etudiants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))