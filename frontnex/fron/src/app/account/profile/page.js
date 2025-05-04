'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [etudiant, setEtudiant] = useState(null);
  const [error, setError] = useState(null); // Déclaration de setError
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
  
      if (!token || !userId) {
        console.error("Aucun ID utilisateur trouvé !");
        router.push('/auth/login');
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/etudiants/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || 'Erreur de chargement');
          return; 
        }
  
        const data = await response.json();
        setEtudiant(data);
  
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [router]);
  
  

  if (isLoading) {
    return (
      <div className="p-4">
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>
      {etudiant ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <p className="mb-2">Email: {etudiant.email}</p>
          <p className="mb-2">Âge: {etudiant.age}</p>
          <p className="mb-2">Département: {etudiant?.departement?.nom || 'Non spécifié'}</p>
          <h3 className="text-lg font-semibold mt-4">Formations suivies:</h3>
          <ul className="list-disc pl-6">
  {etudiant.formations_inscrites?.map((formation, index) => (
    <li key={index}>{formation}</li>
  ))}
</ul>

        </div>
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
}