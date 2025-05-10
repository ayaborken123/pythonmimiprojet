// services.js
import axios from 'axios';

// Configuration globale
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000,
});

// Gestion centralisée des erreurs
const handleError = (error) => {
    if (error.response) {
        console.error('Erreur serveur:', error.response.data);
        throw error.response.data;
    } else {
        console.error('Erreur réseau:', error.message);
        throw { message: 'Problème de connexion au serveur' };
    }
};

export const fetchFavorites = async (userId) => {
    try {
        const response = await apiClient.get(`/api/favorites/${userId}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const toggleFavorite = async (userId, itemId) => {
    try {
        const response = await apiClient.post('/api/favorites', { userId, itemId });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const fetchBooks = async () => {
    try {
        const response = await apiClient.get("/api/books/");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};