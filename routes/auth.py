from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from database.connection import etudiants_collection, sessions_collection
from datetime import datetime, timedelta
import bcrypt
import secrets
from bson import ObjectId

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

    # Vérifier s'il a déjà une session active
    existing_session = await sessions_collection.find_one({
        "user_id": str(user["_id"]),
        "expires": {"$gt": datetime.now()}
    })
    if existing_session:
        return {
            "access_token": existing_session["token"],
            "token_type": "bearer",
            "user_id": str(user["_id"])
        }

    # Générer un token de session
    token = secrets.token_urlsafe(32)
    expires = datetime.now() + timedelta(hours=24)
    
    # Stocker la nouvelle session
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
@router.post("/logout")
async def logout(token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/login"))):
    result = await sessions_collection.delete_one({"token": token})
    if result.deleted_count == 0:
        raise HTTPException(status_code=400, detail="Session introuvable")
    return {"message": "Déconnexion réussie"}

@router.get("/me")
async def get_me(token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/login"))):
    session = await sessions_collection.find_one({"token": token})

    if not session or session["expires"] < datetime.now():
        raise HTTPException(status_code=401, detail="Session invalide ou expirée")
    
    user = await etudiants_collection.find_one({"_id": ObjectId(session["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password"]  # Ne pas renvoyer le mot de passe

    return user
