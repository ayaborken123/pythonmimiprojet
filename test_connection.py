import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="etudiants_db",
        user="postgres",
        password="1234"
    )
    print("✅ Connexion réussie à PostgreSQL")
except Exception as e:
    print(f"❌ Erreur : {e}")