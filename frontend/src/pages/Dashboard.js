import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import DashboardCard from "../components/DashboardCard";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";

const t = {
  en: {
    title: "Dashboard",
    balance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    savings: "Savings Target",
    categories: "Top Categories",
    recent: "Recent Transactions",
  },
  ro: {
    title: "Panou General",
    balance: "Balanță Totală",
    income: "Venituri",
    expenses: "Cheltuieli",
    savings: "Ținta de Economii",
    categories: "Categorii Principale",
    recent: "Tranzacții Recente",
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8,
    rotateX: -45,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  }),
  hover: {
    scale: 1.05,
    rotateY: 5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400,
    },
  },
};

const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 100,
    },
  },
};

const logoVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 100,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400,
    },
  },
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const { formatCurrency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return (window.location.href = "/login");
        const res = await axios.get("/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError("Failed to fetch summary. Please try again later.");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchSummary();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = summary?.totalBalance ?? 0;
  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;
  const categoryCount = Object.keys(summary?.categorySummary ?? {}).length;

  const cards = [
    {
      title: t[language].balance,
      value: formatCurrency(total),
      icon: <FaWallet />,
      type: "highlight",
      delay: 0.2,
    },
    {
      title: t[language].income,
      value: formatCurrency(income),
      icon: <FaArrowDown />,
      type: "income",
      delay: 0.4,
    },
    {
      title: t[language].expenses,
      value: formatCurrency(expenses),
      icon: <FaArrowUp />,
      type: "expense",
      delay: 0.6,
    },
    {
      title: t[language].categories,
      value: `${categoryCount}`,
      icon: <FaChartPie />,
      type: "income",
      delay: 1.0,
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]"><Loader size={48} /></div>
      ) : (
        <>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 animate-gradient-x"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent animate-pulse-slow"></div>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-emerald-500/20 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <motion.div
            className="flex justify-center mb-12 relative z-10"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-2xl opacity-20 animate-pulse-slow"></div>
              <motion.img
                src="/mchLOGO.png"
                alt="MCH Logo"
                className="relative w-28 h-28 object-contain drop-shadow-2xl rounded-full"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl font-bold text-center mb-12 text-gradient relative z-10"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-700">
              {t[language].title}
            </span>
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
            <AnimatePresence>
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="transform-gpu"
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
            </AnimatePresence>
          </div>

          {error && <div className="mt-2 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded p-2">{error}</div>}
        </>
      )}

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
        .text-gradient {
          background: linear-gradient(to right, #10b981, #059669);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
