from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from database.connection import etudiants_collection, sessions_collection
from datetime import datetime, timedelta
import bcrypt
import secrets

router = APIRouter()


router = APIRouter(prefix="/auth", tags=["Authentication"])

# Modèles Pydantic
class UserRegister(BaseModel):
    nom: str
    prenom: str
    email: str
    password: str
    age: int
    departement_id: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserRegister):
    # Vérifier si l'email existe déjà
    if await etudiants_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    # Hasher le mot de passe
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    
    # Créer l'objet étudiant
    etudiant = {
        **user.dict(),
        "password": hashed_password.decode(),
        "created_at": datetime.now(),
        "formations_inscrites": []
    }
    
    # Insérer dans MongoDB
    result = await etudiants_collection.insert_one(etudiant)
    return {"id": str(result.inserted_id)}

@router.post("/login")
async def login(form_data: UserLogin):
    # Trouver l'utilisateur
    user = await etudiants_collection.find_one({"email": form_data.email})
    
    # Vérifier le mot de passe
    if not user or not bcrypt.checkpw(form_data.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    # Générer un token de session
    token = secrets.token_urlsafe(32)
    expires = datetime.now() + timedelta(hours=24)
    
    # Stocker la session
    await sessions_collection.insert_one({
        "user_id": str(user["_id"]),
        "token": token,
        "expires": expires
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user["_id"])
    }
