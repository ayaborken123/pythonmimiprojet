"use client";
import { useEffect, useState } from "react";

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/etudiants");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEtudiants(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Liste des étudiants</h1>
      {etudiants.length === 0 ? (
        <p>Aucun étudiant trouvé</p>
      ) : (
        <ul className="space-y-4">
          {etudiants.map((etudiant) => (
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
                <ul className="list-disc pl-5">
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