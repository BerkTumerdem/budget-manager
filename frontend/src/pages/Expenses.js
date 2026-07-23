import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";
import Loader from "../components/Loader";

const t = {
  en: {
    title: "Transactions",
    amount: "Amount",
    description: "Description",
    date: "Date",
    category: "Select Category (optional)",
    type: "Type",
    expense: "Expense (-)",
    income: "Income (+)",
    add: "Add",
    update: "Update",
    cancel: "Cancel",
    edit: "Edit",
    export: "Export CSV",
    success: "Transaction added",
    updated: "Transaction updated",
    error: "Amount, date and type are required",
    saveError: "Could not save transaction",
    noDescription: "No description",
    noTransactions: "No transactions found.",
    delete: "Delete",
    search: "Search...",
    sortAsc: "Sort ↑",
    sortDesc: "Sort ↓",
    all: "All Types",
    timeRanges: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      year: "1 Year",
      fiveYears: "5 Years",
      all: "All Time",
    },
  },
  ro: {
    title: "Tranzacții",
    amount: "Sumă",
    description: "Descriere",
    date: "Dată",
    category: "Selectează Categorie (opțional)",
    type: "Tip",
    expense: "Cheltuială (-)",
    income: "Venit (+)",
    add: "Adaugă",
    update: "Actualizează",
    cancel: "Anulează",
    edit: "Editează",
    export: "Exportă CSV",
    success: "Tranzacția a fost adăugată",
    updated: "Tranzacția a fost actualizată",
    error: "Sumă, dată și tip sunt obligatorii",
    saveError: "Eroare la salvarea tranzacției",
    noDescription: "Fără descriere",
    noTransactions: "Nicio tranzacție găsită.",
    delete: "Șterge",
    search: "Caută...",
    sortAsc: "Sortare ↑",
    sortDesc: "Sortare ↓",
    all: "Toate Tipurile",
    timeRanges: {
      daily: "Zilnic",
      weekly: "Săptămânal",
      monthly: "Lunar",
      year: "1 An",
      fiveYears: "5 Ani",
      all: "Toate",
    },
  },
};

const emptyForm = {
  amount: "",
  description: "",
  date: "",
  category: "",
  type: "expense",
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const token = localStorage.getItem("token");
  const { formatCurrency } = useCurrency();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  const TIME_RANGES = [
    { label: t[language].timeRanges.daily, value: "daily" },
    { label: t[language].timeRanges.weekly, value: "weekly" },
    { label: t[language].timeRanges.monthly, value: "monthly" },
    { label: t[language].timeRanges.year, value: "year" },
    { label: t[language].timeRanges.fiveYears, value: "5years" },
    { label: t[language].timeRanges.all, value: "all" },
  ];

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        axios.get("/expenses"),
        axios.get("/categories"),
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const startEdit = (tx) => {
    setEditingId(tx._id);
    setFormData({
      amount: String(tx.amount ?? ""),
      description: tx.description || "",
      date: tx.date ? new Date(tx.date).toISOString().split("T")[0] : "",
      category: tx.category?._id || tx.category || "",
      type: tx.type || "expense",
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.amount || !formData.date || !formData.type) {
      return setError(t[language].error);
    }

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      category: formData.category || undefined,
    };

    try {
      if (editingId) {
        await axios.put(`/expenses/${editingId}`, payload);
        setSuccess(t[language].updated);
        setEditingId(null);
      } else {
        await axios.post("/expenses", payload);
        setSuccess(t[language].success);
      }
      setFormData(emptyForm);
      fetchData();
    } catch {
      setError(t[language].saveError);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      if (editingId === id) cancelEdit();
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await axios.get("/export/expenses", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      const today = new Date().toISOString().split("T")[0];
      link.href = url;
      link.setAttribute("download", `expenses_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  const filterByRange = (data) => {
    if (!data) return data;
    if (timeRange === "all") return data;
    const now = new Date();
    let fromDate;
    switch (timeRange) {
      case "daily":
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "weekly":
        fromDate = new Date(now);
        fromDate.setDate(now.getDate() - 6);
        break;
      case "monthly":
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "5years":
        fromDate = new Date(now.getFullYear() - 4, 0, 1);
        break;
      default:
        return data;
    }
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= now;
    });
  };

  const filteredExpenses = filterByRange(expenses)
    .filter(
      (tx) =>
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
    )
    .filter((tx) => (filterType ? tx.type === filterType : true))
    .sort((a, b) =>
      sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

  const chipInactive =
    "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30";

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

          <div className="flex flex-wrap gap-2 mb-6">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-full font-semibold border transition-all duration-200 ${
                  timeRange === range.value
                    ? "bg-emerald-600 text-white border-emerald-700 shadow"
                    : chipInactive
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-10 max-w-xl bg-white/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg"
          >
            {error && (
              <div className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded p-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-900/30 rounded p-2">
                {success}
              </div>
            )}

            <input
              type="number"
              name="amount"
              placeholder={t[language].amount}
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <input
              type="text"
              name="description"
              placeholder={t[language].description}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value="">{t[language].category}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value="expense">{t[language].expense}</option>
              <option value="income">{t[language].income}</option>
            </select>

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
                  onClick={cancelEdit}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-xl font-semibold transition"
                >
                  {t[language].cancel}
                </button>
              )}
              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-semibold shadow transition"
              >
                {t[language].export}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              <input
                type="text"
                placeholder={t[language].search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl"
              >
                <option value="">{t[language].all}</option>
                <option value="expense">{t[language].expense}</option>
                <option value="income">{t[language].income}</option>
              </select>
              <button
                type="button"
                onClick={() => setSortAsc(!sortAsc)}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl"
              >
                {sortAsc ? t[language].sortAsc : t[language].sortDesc}
              </button>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg overflow-hidden">
              {filteredExpenses.length === 0 ? (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {t[language].noTransactions}
                </p>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExpenses.map((tx) => (
                    <div
                      key={tx._id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {tx.description || t[language].noDescription}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(tx.date).toLocaleDateString()}
                            {tx.category?.name ? ` · ${tx.category.name}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <p
                            className={`font-semibold ${
                              tx.type === "expense"
                                ? "text-red-500 dark:text-red-400"
                                : "text-green-500 dark:text-green-400"
                            }`}
                          >
                            {tx.type === "expense" ? "-" : "+"}
                            {formatCurrency(tx.amount)}
                          </p>
                          <button
                            type="button"
                            onClick={() => startEdit(tx)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
                          >
                            {t[language].edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tx._id)}
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
