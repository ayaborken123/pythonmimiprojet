from motor.motor_asyncio import AsyncIOMotorClient

uri = "mongodb+srv://Password123:Password123@cluster0.zlgyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(uri)
db = client["etudiants_db"]

etudiants_collection = db["etudiants"]
departements_collection = db["departements"]
formations_collection = db["formations"]
sessions_collection = db["sessions"]  # <-- Ajouter cette ligne
# Après la création des collections
print(f"Collections disponibles: {db.list_collection_names()}")
# Exporter les collections
def get_db():
    return db

