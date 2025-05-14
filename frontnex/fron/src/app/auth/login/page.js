// src/app/auth/login/page.jsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/auth/login", formData);
      localStorage.setItem("authToken", response.data.access_token);  // Sauvegarder le token
      router.push("/");  // Rediriger vers la page d'accueil ou page après connexion
    } catch (err) {
      setError("Erreur lors de la connexion");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
