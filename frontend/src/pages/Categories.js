import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useLanguage } from "../context/LanguageContext";
import {
  FaPlus,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaTrashAlt,
} from "react-icons/fa";
import Loader from "../components/Loader";

const t = {
  en: {
    title: "Categories",
    placeholder: "Category Name",
    add: "Add Category",
    delete: "Delete",
    required: "Category name is required",
    exists: "Category already exists",
    success: "Category added successfully!",
    fail: "Something went wrong. Try again.",
    unauthorized: "Unauthorized. Please login again.",
    search: "Search categories...",
    sortAsc: "A → Z",
    sortDesc: "Z → A",
    noCategories: "No categories found.",
  },
  ro: {
    title: "Categorii",
    placeholder: "Nume categorie",
    add: "Adaugă Categorie",
    delete: "Șterge",
    required: "Numele categoriei este obligatoriu",
    exists: "Categoria deja există",
    success: "Categoria a fost adăugată!",
    fail: "A apărut o eroare. Încearcă din nou.",
    unauthorized: "Neautorizat. Te rugăm să te reconectezi.",
    search: "Caută categorii...",
    sortAsc: "A → Z",
    sortDesc: "Z → A",
    noCategories: "Nicio categorie găsită.",
  },
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return (window.location.href = "/login");
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/categories", { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return setError(t[language].required);

    const duplicate = categories.find(
      (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) return setError(t[language].exists);

    try {
      await axios.post(
        "/categories",
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setSuccess(t[language].success);
      fetchCategories();
    } catch {
      setError(t[language].fail);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch {
      setError(t[language].fail);
    }
  };

  const filtered = categories
    .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]"><Loader size={48} /></div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">📊 {t[language].title}</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-10 max-w-xl bg-white/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg">
            {error && <p className="text-red-500 dark:text-red-400 text-sm">❌ {error}</p>}
            {success && <p className="text-green-500 dark:text-green-400 text-sm">✅ {success}</p>}

            <input
              type="text"
              name="name"
              placeholder={t[language].placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
            />

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
              >
                {t[language].add}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder={t[language].search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
              />
            </div>

            <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg overflow-hidden">
              {filtered.length === 0 ? (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t[language].noCategories}</p>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((cat) => (
                    <div key={cat._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <p className="font-medium text-gray-900 dark:text-white">
                            {cat.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
                        >
                          {t[language].delete}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
