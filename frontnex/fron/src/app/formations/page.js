'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FormationsPage() {
  const [formations, setFormations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editFormation, setEditFormation] = useState(null)
  const router = useRouter()

  const [nouvelleFormation, setNouvelleFormation] = useState({
    titre: '',
    description: '',
  })

  const handleInputChange = (e) => {
    setNouvelleFormation({
      ...nouvelleFormation,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/formations/')
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
        const data = await response.json()
        setFormations(data)
      } catch (err) {
        setError(err.message)
        console.error("Erreur de récupération:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/formations/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Échec de la suppression')
      setFormations(formations.filter(f => f._id !== id))
    } catch (err) {
      console.error("Erreur de suppression:", err)
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editFormation ? 'PUT' : 'POST'
    const url = editFormation
      ? `http://localhost:8000/formations/${editFormation._id}`
      : "http://localhost:8000/formations/"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelleFormation),
      })

      if (!response.ok) throw new Error("Erreur lors de l'ajout/modification")

      const data = await response.json()

      if (editFormation) {
        setFormations(formations.map(f => f._id === data._id ? data : f))
      } else {
        setFormations([...formations, data])
      }

      setNouvelleFormation({ titre: '', description: '' })
      setEditFormation(null)
      setShowForm(false)
    } catch (err) {
      console.error("Erreur d'ajout/modification:", err)
      setError(err.message)
    }
  }

  const handleEdit = (formation) => {
    setNouvelleFormation({
      titre: formation.titre,
      description: formation.description,
    })
    setEditFormation(formation)
    setShowForm(true)
  }

  const handleAddToFavoris = async (formation) => {
    try {
      const response = await fetch('http://localhost:8000/favoris/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: formation.titre,
          description: formation.description,
        })
      })

      if (!response.ok) throw new Error("Erreur lors de l'ajout aux favoris")

      alert("Ajouté aux favoris !")
      router.push("/favoris")
    } catch (err) {
      console.error("Erreur favoris:", err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative">
        <strong>Erreur : </strong> {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">📚 Catalogue des Formations</h1>
        <button 
          onClick={() => {
            setEditFormation(null)
            setShowForm(!showForm)
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
        >
          {editFormation ? "✏ Modifier la Formation" : "➕ Ajouter une Formation"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Formulaire */}
        {showForm && (
          <div className="p-4 bg-gray-300 rounded-lg shadow-md col-span-1">
            <h2 className="text-xl font-bold text-black mb-2">📝 {editFormation ? "Modifier" : "Ajouter"} une Formation</h2>
            <form onSubmit={handleSubmit} className="grid gap-2">
              <input type="text" name="titre" placeholder="Titre" value={nouvelleFormation.titre} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <input type="text" name="description" placeholder="Description" value={nouvelleFormation.description} onChange={handleInputChange} className="p-1 border rounded bg-white text-black"/>
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
                💾 {editFormation ? "Enregistrer les modifications" : "Ajouter"}
              </button>
            </form>
          </div>
        )}

        {/* Cartes des formations */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {formations.map((formation) => (
            <div key={formation._id} className="bg-white rounded-lg shadow-md border border-gray-400 hover:shadow-xl transition-shadow duration-300 p-6">
              <h2 className="text-lg font-bold text-black mb-2">{formation.titre}</h2>
              <p className="text-sm text-black">{formation.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => handleEdit(formation)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">
                  ✏ Modifier
                </button>
                <button onClick={() => handleDelete(formation._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                  🗑 Supprimer
                </button>
                <button onClick={() => handleAddToFavoris(formation)} className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition">
                  ❤️ Favoris
                </button>
                <button onClick={() => alert("Fonction d'inscription à définir")} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                  📥 S'inscrire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
