// src/app/auth/register/page.jsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", password: "", age: "", departement_id: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:8000/auth/register", formData);
      router.push("/auth/login");  // Rediriger vers la page de connexion après inscription
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
        <input name="prenom" placeholder="Prénom" onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
        <input name="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <input name="age" type="number" placeholder="Âge" onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
        <input name="departement_id" placeholder="ID Département" onChange={(e) => setFormData({ ...formData, departement_id: e.target.value })} required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
