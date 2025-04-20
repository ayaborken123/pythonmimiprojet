from fastapi import FastAPI
from routes import etudiants, departements, formations
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Inclusion des routers
app.include_router(etudiants.router, prefix="/etudiants", tags=["Etudiants"])
app.include_router(departements.router, prefix="/departements", tags=["Departements"])
app.include_router(formations.router, prefix="/formations", tags=["Formations"])

# Configurer CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)