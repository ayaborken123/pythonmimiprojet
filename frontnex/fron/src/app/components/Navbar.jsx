"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Utilisation de useRouter depuis "next/navigation"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");  // Vérifier si un token existe
    setIsLoggedIn(!!token);  // Mettre à jour l'état basé sur la présence du token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");  // Supprimer le token à la déconnexion
    setIsLoggedIn(false);  // Mettre à jour l'état
    router.push("/auth/login");  // Rediriger vers la page de login après déconnexion
  };

  return (
    <div>
      <nav>
        <ul>
          {!isLoggedIn ? (
            <>
              <li>
                <button onClick={() => router.push("/auth/login")}>Connexion</button>
              </li>
              <li>
                <button onClick={() => router.push("/auth/register")}>S'inscrire</button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
