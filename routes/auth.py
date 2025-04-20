from fastapi import APIRouter, HTTPException
from database.connection import etudiants, sessions
from datetime import datetime
import secrets

router = APIRouter()

@router.post("/register")
async def register(nom: str, prenom: str, email: str, password: str):
    # Ajout direct sans vérification
    etudiant = {
        "nom": nom,
        "prenom": prenom,
        "email": email,
        "password": password,  # Non hashé
        "created_at": datetime.now()
    }
    await etudiants.insert_one(etudiant)
    return {"message": "Compte créé"}

@router.post("/login")
async def login(email: str, password: str):
    # Recherche simple
    user = await etudiants.find_one({"email": email, "password": password})
    if not user:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    # Session basique
    token = secrets.token_hex(16)
    await sessions.insert_one({
        "user_id": str(user["_id"]),
        "token": token,
        "created_at": datetime.now()
    })
    
    return {"token": token, "user_id": str(user["_id"])}