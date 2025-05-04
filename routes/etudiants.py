from fastapi import APIRouter, HTTPException
from models.schemas import Etudiant
from database.connection import etudiants_collection
from typing import List
import json
from bson import ObjectId 
from pydantic import BaseModel
import logging
from models.schemas import Etudiant, EtudiantResponse  # Ajouter Etudiant

router = APIRouter()
router = APIRouter(prefix="/etudiants", tags=["Etudiants"])
class EtudiantResponse(BaseModel):
    id: str
    nom: str
    prenom: str
    email: str
    departement_id: str
    formations_inscrites: list
    password: str

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

@router.get("/{etudiant_id}", response_model=EtudiantResponse)
async def get_etudiant(etudiant_id: str):
    try:
        document = await etudiants_collection.find_one({"_id": ObjectId(etudiant_id)})

        if not document:
            raise HTTPException(status_code=404, detail=f"Étudiant avec ID {etudiant_id} introuvable")

        # ✅ Ajouter une conversion explicite du champ `_id` en `id`
        document["id"] = str(document["_id"])
        del document["_id"]  # Supprimer `_id` pour éviter les erreurs de validation

        return EtudiantResponse(**document)

    except Exception as e:
        logging.error(f"Erreur serveur: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur serveur")



@router.get("/", response_model=List[Etudiant])
async def get_etudiants():
    try:
        etudiants = []
        async for doc in etudiants_collection.find():
            try:
                # Conversion des données
                doc["_id"] = str(doc["_id"])
                
                # Logging de débogage
                logging.info(f"Document brut: {doc}")
                
                # Conversion des formations
                if isinstance(doc.get("formations_inscrites"), str):
                    doc["formations_inscrites"] = doc["formations_inscrites"].split(',')
                
                # Validation avec le modèle Pydantic
                etudiant = Etudiant(**doc)
                etudiants.append(etudiant.dict())
                
            except Exception as e:
                logging.error(f"Erreur sur le document {doc['_id']}: {str(e)}")
                continue
                
        return etudiants
        
    except Exception as e:
        logging.critical(f"Erreur globale: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur de traitement des données")