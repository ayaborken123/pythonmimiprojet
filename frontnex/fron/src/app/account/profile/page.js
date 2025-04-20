"use client";
import { useEffect, useState } from 'react';

export default function Profile() {
  const [etudiant, setEtudiant] = useState(null);
  const [departement, setDepartement] = useState(null);
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/etudiants/me');
      const data = await res.json();
      setEtudiant(data);
      
      // Récupérer le département
      const depRes = await fetch(`/api/departements/${data.departement_id}`);
      setDepartement(await depRes.json());
      
      // Récupérer les formations
      const formationsRes = await Promise.all(
        data.formations_inscrites.map(id => 
          fetch(`/api/formations/${id}`).then(res => res.json())
        )
      );
      setFormations(formationsRes);
    };
    fetchData();
  }, []);

  if (!etudiant) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Profil de {etudiant.prenom} {etudiant.nom}</h1>
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <p>Email: {etudiant.email}</p>
          <p>Âge: {etudiant.age}</p>
          <p>Département: {departement?.nom}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Formations suivies</h2>
          <ul className="space-y-2">
            {formations.map(f => (
              <li key={f.id} className="p-2 border-b">
                {f.titre} - {f.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}