from motor.motor_asyncio import AsyncIOMotorClient #client MongoDB asynchrone pour Python (basé sur asyncio)
import os #module pour interagir avec le système d'exploitation (chemin d'accès,

uri = "mongodb+srv://Password123:Password123@cluster0.zlgyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" #chemin d'accès au serveur MongoDB

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017") 
client = AsyncIOMotorClient(uri) #création d'un client MongoDB asynchrone
db = client["etudiants_db"] #nom de la base de données

etudiants_collection = db["etudiants"] #nom de la collection
departements_collection = db["departements"]
formations_collection = db["formations"]
sessions_collection = db["sessions"]  # 
favoris_collection = db["favoris"]

# Après la création des collections
print(f"Collections disponibles: {db.list_collection_names()}") #afficher les collections disponibles
# Exporter les collections
def get_db(): #fonction pour récupérer la base de données
    return db

