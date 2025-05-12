"use client";
import { useEffect, useState } from "react";
import "../styles/globals.css";

export default function BooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/books/")
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues :", data);
        setBooks(data);
      })
      .catch(err => console.error("Erreur lors du chargement :", err));
  }, []);

  const handleScrape = () => {
    fetch("http://localhost:8000/api/scrape-books")
      .then(res => res.json())
      .then(data => alert(data.status))
      .catch(err => alert("Erreur lors du scraping"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const book = {
      title: form.title.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      availability: form.availability.checked,
    };

    fetch("http://localhost:8000/api/books/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    })
      .then(res => res.json())
      .then(data => {
        alert("Livre ajouté !");
        setBooks(prev => [...prev, data]);
        form.reset();
      })
      .catch(err => alert("Erreur d'ajout"));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des livres recommandés</h1>
      <ul className="space-y-4">
        {books.map((book, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p>Prix : £{book.price}</p>
            <p>Catégorie : {book.category}</p>
            <p>Disponible : {book.availability ? "Oui" : "Non"}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={handleScrape}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        Scraper les livres
      </button>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input name="title" placeholder="Titre" required className="border p-2 w-full" />
        <input name="price" type="number" step="0.01" placeholder="Prix" required className="border p-2 w-full" />
        <input name="category" placeholder="Catégorie" required className="border p-2 w-full" />
        <label className="flex items-center space-x-2">
          <input name="availability" type="checkbox" />
          <span>Disponible</span>
        </label>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Ajouter le livre
        </button>
      </form>
    </div>
  );
}
