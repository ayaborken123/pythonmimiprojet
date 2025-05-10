# create_tables.py
from models.database import Base, engine
Base.metadata.create_all(bind=engine)
from models.schemas import RecommendedBook  # <-- Importez le modèle
print("Création des tables PostgreSQL...")
Base.metadata.create_all(bind=engine)
print("✅ Tables créées avec succès !")