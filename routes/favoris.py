# routes/favoris.py
from fastapi import APIRouter, HTTPException
from models.schemas import Formation
from database.connection import favoris_collection
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=Formation)
async def add_favori(formation: Formation):
    formation_dict = formation.model_dump(by_alias=True, exclude={"id"})
    result = await favoris_collection.insert_one(formation_dict)
    created = await favoris_collection.find_one({"_id": result.inserted_id})
    created["_id"] = str(created["_id"])
    return created

@router.get("/", response_model=List[Formation])
async def get_favoris():
    favoris = []
    async for doc in favoris_collection.find():
        doc["_id"] = str(doc["_id"])
        favoris.append(doc)
    return favoris
