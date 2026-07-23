import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useLanguage } from "../context/LanguageContext";
import Loader from "../components/Loader";

const t = {
  en: {
    title: "Categories",
    placeholder: "Category Name",
    color: "Color",
    add: "Add Category",
    update: "Update",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    required: "Category name is required",
    exists: "Category already exists",
    success: "Category added successfully!",
    updated: "Category updated",
    fail: "Something went wrong. Try again.",
    search: "Search categories...",
    sortAsc: "A → Z",
    sortDesc: "Z → A",
    noCategories: "No categories found.",
  },
  ro: {
    title: "Categorii",
    placeholder: "Nume categorie",
    color: "Culoare",
    add: "Adaugă Categorie",
    update: "Actualizează",
    cancel: "Anulează",
    edit: "Editează",
    delete: "Șterge",
    required: "Numele categoriei este obligatoriu",
    exists: "Categoria deja există",
    success: "Categoria a fost adăugată!",
    updated: "Categoria a fost actualizată",
    fail: "A apărut o eroare. Încearcă din nou.",
    search: "Caută categorii...",
    sortAsc: "A → Z",
    sortDesc: "Z → A",
    noCategories: "Nicio categorie găsită.",
  },
};

const DEFAULT_COLOR = "#10b981";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch {
      setError(t[language].fail);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setColor(DEFAULT_COLOR);
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setColor(cat.color || DEFAULT_COLOR);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmed = name.trim();
    if (!trimmed) return setError(t[language].required);

    const duplicate = categories.find(
      (cat) =>
        cat.name.toLowerCase() === trimmed.toLowerCase() && cat._id !== editingId
    );
    if (duplicate) return setError(t[language].exists);

    try {
      if (editingId) {
        await axios.put(`/categories/${editingId}`, { name: trimmed, color });
        setSuccess(t[language].updated);
      } else {
        await axios.post("/categories", { name: trimmed, color });
        setSuccess(t[language].success);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.msg || t[language].fail);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      if (editingId === id) resetForm();
      fetchCategories();
    } catch {
      setError(t[language].fail);
    }
  };

  const filtered = categories
    .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">
            {t[language].title}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-10 max-w-xl bg-white/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg"
          >
            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm font-semibold">{error}</p>
            )}
            {success && (
              <p className="text-green-600 dark:text-green-400 text-sm font-semibold">{success}</p>
            )}

            <input
              type="text"
              placeholder={t[language].placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t[language].color}
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-gray-200 dark:border-gray-600 bg-transparent"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
              >
                {editingId ? t[language].update : t[language].add}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-xl font-semibold transition"
                >
                  {t[language].cancel}
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                type="text"
                placeholder={t[language].search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setSortAsc(!sortAsc)}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl"
              >
                {sortAsc ? t[language].sortAsc : t[language].sortDesc}
              </button>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg overflow-hidden">
              {filtered.length === 0 ? (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {t[language].noCategories}
                </p>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((cat) => (
                    <div
                      key={cat._id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-6 h-6 rounded-full shrink-0 border border-gray-200 dark:border-gray-600"
                            style={{ backgroundColor: cat.color || DEFAULT_COLOR }}
                          />
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {cat.name}
                          </p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
                          >
                            {t[language].edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat._id)}
                            className="text-red-500 dark:text-red-400 hover:underline text-sm"
                          >
                            {t[language].delete}
                          </button>
                        </div>
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
