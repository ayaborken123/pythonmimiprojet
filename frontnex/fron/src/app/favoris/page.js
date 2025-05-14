'use client'
import { useEffect, useState } from 'react'

export default function FavorisPage() {
  const [favoris, setFavoris] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavoris = async () => {
      const res = await fetch("http://localhost:8000/favoris/")
      const data = await res.json()
      setFavoris(data)
      setLoading(false)
    }
    fetchFavoris()
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌟 Vos Favoris</h1>
      <div className="grid grid-cols-2 gap-4">
        {favoris.map((formation) => (
          <div key={formation._id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{formation.titre}</h2>
            <p>{formation.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
