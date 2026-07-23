import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Loader from "../components/Loader";
import { todayLocalKey } from "../utils/date";

const getChartColors = (isDarkMode) => ({
  primary: isDarkMode ? "#10b981" : "#059669", // emerald-500/600
  secondary: isDarkMode ? "#f59e0b" : "#d97706", // amber-500/600
  accent: isDarkMode ? "#3b82f6" : "#2563eb", // blue-500/600
  highlight: isDarkMode ? "#8b5cf6" : "#7c3aed", // violet-500/600
  success: isDarkMode ? "#34d399" : "#10b981", // emerald-400/500
});


const t = {
  en: {
    title: "Expense Report",
    start: "Start Date",
    end: "End Date",
    category: "Category",
    all: "All",
    refresh: "Refresh Report",
    csv: "Export CSV",
    pdf: "Export PDF",
    total: "Total Expenses",
    income: "Total Income",
    balance: "Balance",
    byCategory: "By Category",
    noData: "No report data found.",
    viewAll: "All",
    viewExpenses: "Expenses only",
    viewIncome: "Income only",
    viewLabel: "Show",
    fetchError: "Could not load report data.",
    downloadError: "Download failed.",
  },
  ro: {
    title: "Raport Cheltuieli",
    start: "Data Start",
    end: "Data Sfârșit",
    category: "Categorie",
    all: "Toate",
    refresh: "Actualizează Raport",
    csv: "Exportă CSV",
    pdf: "Exportă PDF",
    total: "Cheltuieli Totale",
    income: "Venit Total",
    balance: "Balanță",
    byCategory: "Pe Categorii",
    noData: "Niciun raport găsit.",
    viewAll: "Toate",
    viewExpenses: "Doar cheltuieli",
    viewIncome: "Doar venituri",
    viewLabel: "Afișează",
    fetchError: "Nu s-au putut încărca datele raportului.",
    downloadError: "Descărcarea a eșuat.",
  },
};

export default function Report() {
  const { isDarkMode } = useTheme();
  const { formatCurrency } = useCurrency();
  const { language } = useLanguage();
  const chartColors = getChartColors(isDarkMode);
  const themeColor = isDarkMode ? "#fff" : "#333";
  const [summary, setSummary] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (start) params.start = start;
      if (end) params.end = end;
      if (category) params.category = category;
      const res = await axios.get("/reports", { params });
      setSummary(res.data);
    } catch (err) {
      setError(t[language].fetchError);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleDownload = async (type) => {
    const base = type === "csv" ? "/export/expenses" : "/pdf/report";
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    if (category) params.category = category;

    try {
      const res = await axios.get(base, {
        params,
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: type === "csv" ? "text/csv" : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${todayLocalKey()}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to download ${type.toUpperCase()}:`, err);
      setError(t[language].downloadError);
    }
  };

  const filteredPieData = summary
    ? Object.entries(summary.categorySummary)
        .filter(([cat, total]) => {
          if (viewMode === "expenses") return total < 0;
          if (viewMode === "income") return total > 0;
          return true;
        })
        .map(([cat, total]) => ({
          name: cat,
          value: Math.abs(total),
        }))
    : [];

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">{t[language].title}</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm mb-1 block">{t[language].start}</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">{t[language].end}</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">{t[language].category}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl"
              >
                <option value="">{t[language].all}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-4">
            <button
              onClick={fetchData}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl shadow transition"
            >
              {t[language].refresh}
            </button>
            <button
              onClick={() => handleDownload("csv")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl shadow transition"
            >
              {t[language].csv}
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow transition"
            >
              {t[language].pdf}
            </button>
            <label className="font-medium flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {t[language].viewLabel}:
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl w-full sm:w-auto"
              >
                <option value="all">{t[language].viewAll}</option>
                <option value="expenses">{t[language].viewExpenses}</option>
                <option value="income">{t[language].viewIncome}</option>
              </select>
            </label>
          </div>

          {summary ? (
            <div className="space-y-8 mt-8">
              <div className="bg-white/70 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow backdrop-blur">
                <h3 className="text-xl font-semibold mb-4">
                  {t[language].balance} & {t[language].total}
                </h3>
                <div className="space-y-2 text-lg">
                  <p>
                    <strong>{t[language].balance}:</strong> {formatCurrency(summary.totalBalance)}
                  </p>
                  <p>
                    <strong>{t[language].income}:</strong> {formatCurrency(summary.income)}
                  </p>
                  <p>
                    <strong>{t[language].total}:</strong> {formatCurrency(summary.expenses)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t[language].byCategory}</h3>

                <div className="w-full min-h-[280px] sm:min-h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      isAnimationActive
                    >
                      {filteredPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Object.values(chartColors)[index % Object.keys(chartColors).length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ color: themeColor }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                </div>

                <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={280} minWidth={280}>
                  <BarChart
                    data={filteredPieData}
                    margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                    barSize={24}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                    <XAxis dataKey="name" stroke={themeColor} interval={0} angle={-25} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
                    <YAxis stroke={themeColor} width={40} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Bar dataKey="value" isAnimationActive>
                      {filteredPieData.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={Object.values(chartColors)[index % Object.keys(chartColors).length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>

              <ul className="space-y-2">
                {Object.entries(summary.categorySummary)
                  .filter(([cat, total]) => {
                    if (viewMode === "expenses") return total < 0;
                    if (viewMode === "income") return total > 0;
                    return true;
                  })
                  .map(([cat, total]) => (
                    <li
                      key={cat}
                      className="flex justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow"
                    >
                      <span className="font-medium">{cat}</span>
                      <span className={total >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {formatCurrency(Math.abs(total))}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic mt-6">{t[language].noData}</p>
          )}
          {error && <div className="mt-2 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded p-2">{error}</div>}
        </>
      )}
    </div>
  );
}
