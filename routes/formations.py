from fastapi import APIRouter, HTTPException
from models.schemas import Formation
from database.connection import formations_collection
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=Formation)
async def create_formation(formation: Formation):
    try:
        formation_dict = formation.model_dump(by_alias=True, exclude={"id"})
        
        # Nettoyage supplémentaire pour les données mal formatées
        if isinstance(formation_dict.get("description"), str) and not formation_dict["description"]:
            formation_dict["description"] = "Aucune description fournie"
        
        result = await formations_collection.insert_one(formation_dict)
        created = await formations_collection.find_one({"_id": result.inserted_id})
        created["_id"] = str(created["_id"])
        return created
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Erreur de format des données: {str(e)}")

@router.get("/", response_model=List[Formation])
async def get_all_formations():
    try:
        formations = []
        async for doc in formations_collection.find():
            doc["_id"] = str(doc["_id"])
            formations.append(doc)
        return formations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{formation_id}", response_model=Formation)
async def get_formation(formation_id: str):
    try:
        if not ObjectId.is_valid(formation_id):
            raise HTTPException(status_code=400, detail="ID de formation invalide")
        
        formation = await formations_collection.find_one({"_id": ObjectId(formation_id)})
        if not formation:
            raise HTTPException(status_code=404, detail="Formation non trouvée")
        
        formation["_id"] = str(formation["_id"])
        return formation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{formation_id}", response_model=Formation)
async def update_formation(formation_id: str, formation: Formation):
    try:
        if not ObjectId.is_valid(formation_id):
            raise HTTPException(status_code=400, detail="ID de formation invalide")
        
        formation_dict = formation.model_dump(by_alias=True, exclude={"id"})
        
        update_result = await formations_collection.update_one(
            {"_id": ObjectId(formation_id)},
            {"$set": formation_dict}
        )
        
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Formation non trouvée")
        
        updated = await formations_collection.find_one({"_id": ObjectId(formation_id)})
        updated["_id"] = str(updated["_id"])
        return updated
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{formation_id}")
async def delete_formation(formation_id: str):
    try:
        if not ObjectId.is_valid(formation_id):
            raise HTTPException(status_code=400, detail="ID de formation invalide")
        
        delete_result = await formations_collection.delete_one({"_id": ObjectId(formation_id)})
        
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Formation non trouvée")
        
        return {"message": "Formation supprimée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))