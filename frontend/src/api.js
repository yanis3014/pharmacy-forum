// frontend/src/api.js

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

/*
  INTERCEPTEUR :
  Ce code s'exécute avant chaque requête envoyée par `api`.
  Il vérifie si un token est stocké dans le localStorage (après connexion)
  et l'ajoute automatiquement dans les en-têtes de la requête.
  Cela évite de devoir ajouter le token manuellement à chaque fois.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
