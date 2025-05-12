'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import "../styles/globals.css";

export default function DepartementsPage() {
  const [departements, setDepartements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false) // ✅ État pour afficher ou masquer le formulaire
  const router = useRouter()

  // ✅ État pour le nouveau département
  const [nouveauDepartement, setNouveauDepartement] = useState({
    nom: '',
    description: '',
    responsable: '',
    email: '',
    telephone: '',
    nombre_etudiants: '',
    date_creation: '',
    batiment: '',
    active: true
  });

  // ✅ Gérer les changements du formulaire
  const handleInputChange = (e) => {
    setNouveauDepartement({
      ...nouveauDepartement,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Récupération des départements
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/departements/')
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json()
        console.log("Départements récupérés :", data) // ✅ Vérification console
        setDepartements(data)
      } catch (err) {
        setError(err.message)
        console.error("Erreur de récupération:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ✅ Suppression d'un département
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/departements/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Échec de la suppression')
      }
      
      // Rafraîchir la liste après suppression
      setDepartements(departements.filter(dep => dep._id !== id))
    } catch (err) {
      console.error("Erreur de suppression:", err)
      setError(err.message)
    }
  }

  // ✅ Ajout d'un département via le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Empêche la soumission automatique du formulaire

    try {
      const response = await fetch("http://localhost:8000/departements/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauDepartement)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du département");
      }

      const data = await response.json();
      console.log("Département ajouté :", data) // ✅ Vérification console

      setDepartements((prev) => [...prev, data]) // ✅ Ajoute le département à la liste

      // ✅ Réinitialiser le formulaire après ajout
      setNouveauDepartement({
        nom: '',
        description: '',
        responsable: '',
        email: '',
        telephone: '',
        nombre_etudiants: '',
        date_creation: '',
        batiment: '',
        active: true
      });

      setShowForm(false) // ✅ Masquer le formulaire après ajout

    } catch (err) {
      console.error("Erreur d'ajout:", err);
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong>Erreur : </strong> {error}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">📌 Gestion des Départements</h1>
        <button 
          onClick={() => setShowForm(!showForm)} // ✅ Afficher ou masquer le formulaire
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
        >
          ➕ Ajouter un Département
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ✅ Afficher le formulaire à côté des départements */}
        {showForm && (
          <div className="p-4 bg-gray-300 rounded-lg shadow-md col-span-1">
            <h2 className="text-xl font-bold text-black mb-2">📝 Ajouter un Département</h2>
            <form onSubmit={handleSubmit} className="grid gap-2">
              <input type="text" name="nom" placeholder="Nom" value={nouveauDepartement.nom} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="text" name="description" placeholder="Description" value={nouveauDepartement.description} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="text" name="responsable" placeholder="Responsable" value={nouveauDepartement.responsable} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="email" name="email" placeholder="Email" value={nouveauDepartement.email} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="text" name="telephone" placeholder="Téléphone" value={nouveauDepartement.telephone} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="number" name="nombre_etudiants" placeholder="Nombre d'étudiants" value={nouveauDepartement.nombre_etudiants} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="text" name="batiment" placeholder="Batiment" value={nouveauDepartement.batiment} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>

              <div className="flex items-center">
                <input type="checkbox" name="active" checked={nouveauDepartement.active} onChange={(e) => setNouveauDepartement({...nouveauDepartement, active: e.target.checked})} className="mr-2"/>
                <label className="text-black">✔ Actif</label>
              </div>

              <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
                💾 Enregistrer
              </button>
            </form>
          </div>
        )}

        {/* ✅ Affichage des départements */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {departements.map((departement) => (
            <div key={departement._id} className="bg-white rounded-lg shadow-md border border-gray-400 hover:shadow-xl transition-shadow duration-300 p-6">
              <h2 className="text-lg font-bold text-black mb-2">{departement.nom}</h2>
              <p className="text-sm text-black">{departement.description}</p>
              <p className="font-semibold text-black">🏢 Bâtiment : {departement.batiment}</p>
              <p className="font-semibold text-black">👤 Responsable : {departement.responsable}</p>
              <p className="font-semibold text-black">📧 Email : {departement.email}</p>
              <p className="font-semibold text-black">📞 Téléphone : {departement.telephone}</p>
              <p className="font-semibold text-black">🎓 Nombre d'étudiants : {departement.nombre_etudiants}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
