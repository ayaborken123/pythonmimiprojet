"use client"; // Indique que c'est un composant côté client
import { useEffect, useState } from "react"; //Gère l'état local du composant et effect Gère les effets de bord (chargement des données)
import { useRouter } from "next/navigation"; // Ajout important

export default function EtudiantsPage() { //États initiaux
  const [etudiants, setEtudiants] = useState([]); // Liste des étudiants à afficher
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Nécessaire pour la redirection

  useEffect(() => { //Récupération des données
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/etudiants", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        // Gestion des réponses non autorisées
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/auth/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        const data = await response.json();
        setEtudiants(data);
      } catch (err) {
        console.error("Erreur de récupération:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);
  

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return ( //Rendu principal Utilise Tailwind CSS pour le styling
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Liste des étudiants</h1>
      {etudiants.length === 0 ? (
        <p>Aucun étudiant trouvé</p>
      ) : (
        <ul className="space-y-4">
          {etudiants.map((etudiant) => ( //Boucle des étudiants : Utilise map() pour itérer sur le tableau
            <li key={etudiant._id} className="border p-4 rounded shadow">
              {/* Photo de l'étudiant */}
              {etudiant.photo_url && (
                <img 
                  src={etudiant.photo_url} 
                  alt={`Photo de ${etudiant.prenom} ${etudiant.nom}`}
                  className="w-20 h-20 object-cover rounded-full mb-2"
                />
              )}
              
              {/* Informations principales */}
              <p><strong>ID de l'étudiant:</strong> {etudiant._id}</p>
              <p><strong>Nom complet:</strong> {etudiant.nom} {etudiant.prenom}</p>
              <p><strong>Âge:</strong> {etudiant.age}</p>
              <p><strong>Email:</strong> {etudiant.email}</p>
              <p><strong>Département:</strong> {etudiant.departement_id}</p>
              
              {/* Formations */}
              <div>
                <strong>Formations:</strong>
                <ul className="list-disc pl-6">
  {etudiant.formations_inscrites?.map((formation, index) => (
    <li key={index}>{formation}</li>
  ))}
</ul>

              </div>
              
              {/* URL de la photo */}
              {etudiant.photo_url && (
                <p><strong>Photo URL:</strong> {etudiant.photo_url}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}