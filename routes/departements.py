from fastapi import APIRouter, HTTPException
from models.schemas import Departement
from database.connection import departements_collection
from bson import ObjectId
from typing import List



router = APIRouter()  # Supprimez le prefix ici

@router.post("/", response_model=Departement)
async def create_departement(departement: Departement):
    try:
        departement_dict = departement.model_dump(by_alias=True, exclude={"id"})
        
        # Nettoyage supplémentaire pour les données mal formatées
        if isinstance(departement_dict.get("nombre_etudiants"), str):
            departement_dict["nombre_etudiants"] = int(departement_dict["nombre_etudiants"].strip())
        
        if isinstance(departement_dict.get("active"), str):
            departement_dict["active"] = departement_dict["active"].lower() == "true"
        
        result = await departements_collection.insert_one(departement_dict)
        created = await departements_collection.find_one({"_id": result.inserted_id})
        created["_id"] = str(created["_id"])
        return created
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Erreur de format des données: {str(e)}")



@router.get("/", response_model=List[Departement])
async def get_all_departements():
    try:
        departements = []
        async for doc in departements_collection.find():
            doc["_id"] = str(doc["_id"])
            departements.append(doc)
        return departements
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))