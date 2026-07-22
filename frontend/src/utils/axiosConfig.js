// utils/axiosConfig.js
import axios from "axios";

// Creează o instanță Axios cu baza setată
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor care adaugă token-ul JWT la fiecare request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funcție pentru a schimba limba global (scrie în localStorage)
export const setLang = (lang) => {
  localStorage.setItem("lang", lang);
};

export default instance;
