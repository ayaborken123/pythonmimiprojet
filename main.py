from fastapi import FastAPI
from routes import etudiants, departements, formations
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from database.connection import db  # <-- Ajouter cette ligne
from routes.etudiants import router as etudiants_router
from routes import recommendations, books  # ✅ Import correct
app = FastAPI()
app = FastAPI(debug=True)  # <-- Activer le mode debug

# Inclusion des routers
app.include_router(etudiants.router, prefix="/etudiants", tags=["Etudiants"])
app.include_router(departements.router, prefix="/departements", tags=["Departements"])
app.include_router(formations.router, prefix="/formations", tags=["Formations"])
app.include_router(auth_router)
app.include_router(etudiants_router)
app.include_router(recommendations.router, prefix="/api")
app.include_router(books.router, prefix="/api")


# Configurer CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"] 
)
@app.on_event("startup")
async def startup_db_client():
    # Vérifier la connexion
    await db.command("ping")
    
    # Créer les collections manquantes
    existing_collections = await db.list_collection_names()
    
    if "sessions" not in existing_collections:
        await db.create_collection("sessions")
    
    print("✅ Collections disponibles:", existing_collections)
