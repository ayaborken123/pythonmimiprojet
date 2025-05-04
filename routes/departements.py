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

        # Vérifier et nettoyer les données
        departement_dict["nombre_etudiants"] = int(departement_dict.get("nombre_etudiants", 0))
        departement_dict["active"] = str(departement_dict.get("active", "true")).lower() == "true"

        result = await departements_collection.insert_one(departement_dict)
        
        created = await departements_collection.find_one({"_id": result.inserted_id})
        if not created:
            raise HTTPException(status_code=500, detail="Erreur lors de la création du département")

        created["_id"] = str(created["_id"])  # Convertir ObjectId en string pour éviter les erreurs de validation
        return Departement(**created)

    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Erreur lors de la création du département: {str(e)}")




@router.get("/", response_model=List[Departement])
async def get_all_departements():
    try:
        departements = []
        async for doc in departements_collection.find():
            print("Département trouvé :", doc)  # ✅ Ajoute ce log
            doc["_id"] = str(doc["_id"])  # Convertir `_id`
            departements.append(doc)

        if not departements:
            raise HTTPException(status_code=404, detail="Aucun département trouvé")

        return departements
    except Exception as e:
        logging.error(f"Erreur serveur: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des départements")


@router.delete("/{departement_id}")
async def delete_departement(departement_id: str):
    try:
        if ObjectId.is_valid(departement_id):  # ✅ Vérifie si l'ID est valide
            result = await departements_collection.delete_one({"_id": ObjectId(departement_id)})
        else:
            result = await departements_collection.delete_one({"id": departement_id})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Département non trouvé")

        return {"message": "Département supprimé avec succès"}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du département")
