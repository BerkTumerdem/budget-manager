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
    export: "Export CSV",
    success: "Transaction added",
    error: "Amount, date and type are required",
    saveError: "Could not save transaction",
    noDescription: "No description",
    noTransactions: "No transactions found.",
    delete: "Delete",
    search: "Search...",
    filter: "Filter",
    sortAsc: "Sort ↑",
    sortDesc: "Sort ↓",
    all: "All Types",
    timeRanges: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      year: "1 Year",
      fiveYears: "5 Years",
      all: "All Time"
    }
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
    export: "Exportă CSV",
    success: "Tranzacția a fost adăugată",
    error: "Sumă, dată și tip sunt obligatorii",
    saveError: "Eroare la salvarea tranzacției",
    noDescription: "Fără descriere",
    noTransactions: "Nicio tranzacție găsită.",
    delete: "Șterge",
    search: "Caută...",
    filter: "Filtru",
    sortAsc: "Sortare ↑",
    sortDesc: "Sortare ↓",
    all: "Toate Tipurile",
    timeRanges: {
      daily: "Zilnic",
      weekly: "Săptămânal",
      monthly: "Lunar",
      year: "1 An",
      fiveYears: "5 Ani",
      all: "Toate"
    }
  }
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
    type: "expense",
  });
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
    if (!token) return (window.location.href = "/login");
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        axios.get("/expenses", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/categories", { headers: { Authorization: `Bearer ${token}` } }),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.amount || !formData.date || !formData.type) {
      return setError(t[language].error);
    }

    try {
      await axios.post("/expenses", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ amount: "", description: "", date: "", category: "", type: "expense" });
      setSuccess(t[language].success);
      fetchData();
    } catch {
      setError(t[language].saveError);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    .filter((tx) =>
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm)
    )
    .filter((tx) => (filterType ? tx.type === filterType : true))
    .sort((a, b) =>
      sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]"><Loader size={48} /></div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">💸 {t[language].title}</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-full font-semibold border transition-all duration-200
                  ${timeRange === range.value
                    ? "bg-emerald-600 text-white border-emerald-700 shadow"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-emerald-700 hover:text-white"}
                `}
              >
                {range.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-10 max-w-xl bg-white/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg">
            {error && <div className="mt-2 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded p-2">{error}</div>}
            {success && <div className="mt-2 text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-900/30 rounded p-2">{success}</div>}

            <input
              type="number"
              name="amount"
              placeholder={t[language].amount}
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
            />
            <input
              type="text"
              name="description"
              placeholder={t[language].description}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
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
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
            >
              <option value="expense">{t[language].expense}</option>
              <option value="income">{t[language].income}</option>
            </select>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
              >
                {t[language].add}
              </button>
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
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder={t[language].search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-colors duration-200"
              >
                <option value="">{t[language].all}</option>
                <option value="expense">{t[language].expense}</option>
                <option value="income">{t[language].income}</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                {sortAsc ? t[language].sortAsc : t[language].sortDesc}
              </button>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur shadow-lg overflow-hidden">
              {filteredExpenses.length === 0 ? (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t[language].noTransactions}</p>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExpenses.map((tx) => (
                    <div key={tx._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {tx.description || t[language].noDescription}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={`font-semibold ${tx.type === "expense" ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}>
                            {tx.type === "expense" ? "-" : "+"}{formatCurrency(tx.amount)}
                          </p>
                          <button
                            onClick={() => handleDelete(tx._id)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
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
