# models/database.py
from sqlalchemy.ext.declarative import declarative_base #Pour créer des classes de modèles ORM
from sqlalchemy import create_engine #Pour se connecter à la base de données
from sqlalchemy.orm import sessionmaker #pour créer des sessions de base de données
import os
from dotenv import load_dotenv #Charge les variables d'environnement depuis un fichier .env

load_dotenv()

# Configuration de la base de données
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/student_db")
engine = create_engine(DATABASE_URL) #Crée le moteur de connexion à PostgreSQL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Déclaration de Base
Base = declarative_base()  # Base pour toutes les classes de modèles

def get_db(): # Fournit la session
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()