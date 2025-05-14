"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erreur lors de la récupération du profil");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (!user) return <p>Aucun utilisateur connecté</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📌 Informations personnelles</h1>
      <p>✉️ <strong>Email :</strong> {user.email}</p>
      <p>🎂 <strong>Âge :</strong> {user.age}</p>
      <p>🏢 <strong>Département :</strong> {user.departement_id || "Non spécifié"}</p>

      <h2 className="mt-6 text-xl font-semibold">🎓 Formations inscrites</h2>
      {user.formations_inscrites?.length > 0 ? (
        <ul className="list-disc pl-5">
          {user.formations_inscrites.map((f, index) => (
            <li key={index}>{f}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune formation inscrite.</p>
      )}

      <h2 className="mt-6 text-xl font-semibold">⭐ Formations favorites</h2>
      {/* Ajoute si tu gères les favoris plus tard */}
      <p>Aucune formation favorite.</p>
    </div>
  );
}
