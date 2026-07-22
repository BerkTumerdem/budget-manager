import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartPie,
  FaCog,
  FaCalendarAlt,
  FaFolderOpen,
  FaSignOutAlt,
  FaBars,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { motion } from "framer-motion";

const translations = {
  en: {
    dashboard: "Dashboard",
    expenses: "Expenses",
    categories: "Categories",
    report: "Report",
    settings: "Settings",
    calendar: "Calendar",
    logout: "Logout",
    dark: "Dark Mode",
    light: "Light Mode",
  },
  ro: {
    dashboard: "Tablou",
    expenses: "Cheltuieli",
    categories: "Categorii",
    report: "Raport",
    settings: "Setări",
    calendar: "Calendar",
    logout: "Delogare",
    dark: "Mod Întunecat",
    light: "Mod Luminos",
  },
};

// Utility to decode JWT and extract email
function getUserEmailFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user?.email || payload.email || null;
  } catch {
    return null;
  }
}

const Sidebar = () => {
  const { language: lang } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const t = translations[lang];
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "/avatar.png");
  const userEmail = getUserEmailFromToken();

  useEffect(() => {
    const handleStorageChange = () => {
      const newAvatar = localStorage.getItem("avatar");
      if (newAvatar) {
        setAvatar(newAvatar);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const linkClass = (path) =>
    `flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
      location.pathname === path
        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-emerald-600 dark:hover:text-emerald-300"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 shadow-2xl hidden md:flex flex-col items-center font-sans transition-all duration-300 relative overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100/50 via-gray-100/80 to-gray-100 dark:from-gray-900/50 dark:via-gray-900/80 dark:to-gray-900"></div>
      </div>

      <div className="w-full flex justify-between items-center mb-8 px-1 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
        >
          <FaBars size={18} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </motion.button>
      </div>

      <motion.div 
        className="mb-8 text-center flex flex-col items-center relative z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <img
            src="/mchLOGO.png"
            alt="MCH Logo"
            className="relative w-14 h-14 mb-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
        {!collapsed && (
          <>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent tracking-wide">
              Money Control Hub
            </h1>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 uppercase mt-1">
              Since 2025
            </span>
          </>
        )}
      </motion.div>

      <nav className="w-full space-y-2 relative z-10">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/" className={linkClass("/")}>
            <FaHome className="text-lg" />
            {!collapsed && t.dashboard}
          </Link>
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/expenses" className={linkClass("/expenses")}>
            <FaMoneyBillWave className="text-lg" />
            {!collapsed && t.expenses}
          </Link>
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/categories" className={linkClass("/categories")}>
            <FaFolderOpen className="text-lg" />
            {!collapsed && t.categories}
          </Link>
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/report" className={linkClass("/report")}>
            <FaChartPie className="text-lg" />
            {!collapsed && t.report}
          </Link>
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/calendar" className={linkClass("/calendar")}>
            <FaCalendarAlt className="text-lg" />
            {!collapsed && t.calendar}
          </Link>
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/settings" className={linkClass("/settings")}>
            <FaCog className="text-lg" />
            {!collapsed && t.settings}
          </Link>
        </motion.div>
      </nav>

      <div className="mt-auto w-full relative z-10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-center cursor-pointer p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-md opacity-20 animate-pulse"></div>
            <img
              src={avatar}
              alt="User"
              className="relative w-10 h-10 rounded-full border-2 border-emerald-500/50 object-cover shadow-lg"
            />
          </div>
          {!collapsed && (
            <div className="ml-3 text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                {userEmail || "Guest"}
              </p>
            </div>
          )}
        </motion.div>

        {menuOpen && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-14 left-0 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-emerald-500/20 rounded-xl shadow-lg z-50"
          >
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors duration-300"
            >
              <FaCog className="mr-2" /> {t.settings}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-500 dark:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-200 transition-colors duration-300"
            >
              <FaSignOutAlt className="mr-2" /> {t.logout}
            </button>
          </motion.div>
        )}
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center text-xs text-emerald-600/60 dark:text-emerald-500/60 relative z-10"
        >
          <p>© MCH • Budget Pro</p>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
