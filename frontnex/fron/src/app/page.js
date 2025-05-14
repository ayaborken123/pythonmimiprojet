"use client";

import Link from "next/link";
import "./styles/globals.css";

export default function Home() {
  const cards = [
    { title: "Nos Étudiants", link: "/etudiants", color: "bg-blue-100" },
    { title: "Nos Départements", link: "/departements", color: "bg-green-100" },
    { title: "Nos Formations", link: "/formations", color: "bg-yellow-100" },
    { title: "Nos Livres", link: "/books", color: "bg-purple-100" },
  ];

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Bienvenue sur l'application de gestion
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Cliquez sur une section pour commencer.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            className={`rounded-xl shadow-md p-6 text-center text-lg font-semibold hover:scale-105 transition-transform duration-200 ${card.color}`}
          >
            {card.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
