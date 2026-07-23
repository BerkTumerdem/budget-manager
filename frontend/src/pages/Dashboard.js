import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import DashboardCard from "../components/DashboardCard";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
  FaPiggyBank,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import Loader from "../components/Loader";

const t = {
  en: {
    title: "Dashboard",
    balance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    savings: "Savings Target",
    categories: "Top Categories",
    fetchError: "Could not load dashboard data.",
  },
  ro: {
    title: "Panou General",
    balance: "Balanță Totală",
    income: "Venituri",
    expenses: "Cheltuieli",
    savings: "Ținta de Economii",
    categories: "Categorii Principale",
    fetchError: "Nu s-au putut încărca datele panoului.",
  },
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [reportRes, goalRes] = await Promise.all([
          axios.get("/reports"),
          axios.get("/settings/savings-goal").catch(() => ({ data: { goal: 0 } })),
        ]);
        setSummary(reportRes.data);
        setSavingsGoal(Number(goalRes.data?.goal) || 0);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(t[language].fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const total = summary?.totalBalance ?? 0;
  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;
  const categoryCount = Object.keys(summary?.categorySummary ?? {}).length;
  const savedSoFar = Math.max(0, income - expenses);
  const goalProgress =
    savingsGoal > 0 ? Math.min(100, Math.round((savedSoFar / savingsGoal) * 100)) : 0;

  const cards = [
    {
      title: t[language].balance,
      value: formatCurrency(total),
      icon: <FaWallet />,
      type: "highlight",
    },
    {
      title: t[language].income,
      value: formatCurrency(income),
      icon: <FaArrowUp />,
      type: "income",
    },
    {
      title: t[language].expenses,
      value: formatCurrency(expenses),
      icon: <FaArrowDown />,
      type: "expense",
    },
    {
      title: t[language].savings,
      value:
        savingsGoal > 0
          ? `${formatCurrency(savedSoFar)} / ${formatCurrency(savingsGoal)} (${goalProgress}%)`
          : formatCurrency(savedSoFar),
      icon: <FaPiggyBank />,
      type: "income",
    },
    {
      title: t[language].categories,
      value: `${categoryCount}`,
      icon: <FaChartPie />,
      type: "income",
    },
  ];

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-transparent text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden relative">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <motion.div
            className="flex justify-center mb-8 relative z-10"
            {...fade}
          >
            <img
              src="/mchLOGO.png"
              alt="MCH Logo"
              className="w-24 h-24 object-contain rounded-full"
            />
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-center mb-10 relative z-10 text-emerald-700 dark:text-emerald-400"
            {...fade}
          >
            {t[language].title}
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto relative z-10">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { delay: index * 0.06, duration: 0.3 }
                }
              >
                <DashboardCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  type={card.type}
                  highlight={card.type === "highlight"}
                />
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="mt-6 max-w-7xl mx-auto text-red-600 dark:text-red-400 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded-xl p-3">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
