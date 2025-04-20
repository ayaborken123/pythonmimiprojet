'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DepartementsPage() {
  const [departements, setDepartements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/departements/')
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json()
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong>Erreur : </strong> {error}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Départements</h1>
        <Link 
          href="/departements/ajouter"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Ajouter un Département
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departements.map((departement) => (
          <div key={departement._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">{departement.nom}</h2>
              <p className="text-blue-100 text-sm">{departement.batiment}</p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">{departement.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Responsable:</span>
                  <span>{departement.responsable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Étudiants:</span>
                  <span>{departement.nombre_etudiants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-blue-600">{departement.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Téléphone:</span>
                  <span>{departement.telephone}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  departement.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {departement.active ? 'Actif' : 'Inactif'}
                </span>
                
                <div className="space-x-2">
                  <button
                    onClick={() => router.push(`/departements/${departement._id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(departement._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}