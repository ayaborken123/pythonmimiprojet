"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
      <nav className="flex justify-between items-center">
        <div className="flex space-x-6">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/etudiants" className="hover:underline">Étudiants</Link>
          <Link href="/departements" className="hover:underline">Départements</Link>
          <Link href="/formations" className="hover:underline">Formations</Link>
          <Link href="/books" className="hover:underline">Livres</Link>

        </div>
        <div className="flex space-x-4">
          <Link href="/auth/login" className="hover:underline">Se connecter</Link>
          <Link href="/auth/register" className="hover:underline">S'inscrire</Link>
        </div>
      </nav>
    </header>
  );
}