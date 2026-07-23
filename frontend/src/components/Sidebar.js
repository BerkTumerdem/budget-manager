import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  FaTimes,
} from "react-icons/fa";

const translations = {
  en: {
    dashboard: "Dashboard",
    expenses: "Expenses",
    categories: "Categories",
    report: "Report",
    settings: "Settings",
    calendar: "Calendar",
    logout: "Logout",
    menu: "Menu",
    brand: "Money Control Hub",
    since: "Since 2025",
    guest: "Guest",
    footer: "MCH Budget",
    toggleTheme: "Toggle theme",
    close: "Close",
    closeMenu: "Close menu",
  },
  ro: {
    dashboard: "Tablou",
    expenses: "Cheltuieli",
    categories: "Categorii",
    report: "Raport",
    settings: "Setări",
    calendar: "Calendar",
    logout: "Delogare",
    menu: "Meniu",
    brand: "Money Control Hub",
    since: "Din 2025",
    guest: "Oaspete",
    footer: "MCH Budget",
    toggleTheme: "Comută tema",
    close: "Închide",
    closeMenu: "Închide meniul",
  },
};

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

const navItems = [
  { path: "/", icon: FaHome, labelKey: "dashboard" },
  { path: "/expenses", icon: FaMoneyBillWave, labelKey: "expenses" },
  { path: "/categories", icon: FaFolderOpen, labelKey: "categories" },
  { path: "/report", icon: FaChartPie, labelKey: "report" },
  { path: "/calendar", icon: FaCalendarAlt, labelKey: "calendar" },
  { path: "/settings", icon: FaCog, labelKey: "settings" },
];

const Sidebar = () => {
  const { language: lang } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const t = translations[lang];
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "/avatar.png");
  const userEmail = getUserEmailFromToken();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newAvatar = localStorage.getItem("avatar");
      if (newAvatar) setAvatar(newAvatar);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const linkClass = (path) =>
    `flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-emerald-600 dark:hover:text-emerald-300"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    window.location.assign("/login");
  };

  const navContent = (showLabels) => (
    <>
      <div className="mb-6 text-center flex flex-col items-center">
        <img
          src="/mchLOGO.png"
          alt="MCH Logo"
          className="w-12 h-12 mb-2 rounded-full shadow-lg object-contain"
        />
        {showLabels && (
          <>
            <h1 className="text-base font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent tracking-wide px-2">
              {t.brand}
            </h1>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 uppercase mt-1">
              {t.since}
            </span>
          </>
        )}
      </div>

      <nav className="w-full space-y-1 flex-1">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <Link
            key={path}
            to={path}
            className={linkClass(path)}
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="text-lg shrink-0" />
            {showLabels && <span className="truncate">{t[labelKey]}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-4 w-full border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-3 px-2 mb-3 min-w-0">
          <img
            src={avatar}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-emerald-500/50 object-cover shrink-0 bg-gray-200 dark:bg-gray-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml," +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="#374151" width="40" height="40"/><circle cx="20" cy="15" r="8" fill="#9ca3af"/><ellipse cx="20" cy="36" rx="12" ry="10" fill="#9ca3af"/></svg>'
                );
            }}
          />
          {showLabels && (
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate min-w-0">
              {userEmail || t.guest}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-sm text-red-500 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <FaSignOutAlt className="shrink-0" />
          {showLabels && t.logout}
        </button>
        {showLabels && (
          <p className="mt-3 text-center text-xs text-emerald-600/60 dark:text-emerald-500/60">
            {t.footer}
          </p>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button
          type="button"
          aria-label={t.menu}
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FaBars size={20} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <img src="/mchLOGO.png" alt="" className="w-8 h-8 rounded-full object-contain" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm truncate">
            MCH
          </span>
        </div>
        <button
          type="button"
          aria-label={t.toggleTheme}
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={t.closeMenu}
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-[min(18rem,85vw)] bg-white dark:bg-gray-900 p-4 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.menu}</span>
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FaTimes size={18} />
          </button>
        </div>
        {navContent(true)}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-white p-4 shadow-2xl hidden md:flex flex-col items-center font-sans transition-all duration-300 relative overflow-hidden shrink-0`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100/50 via-gray-100/80 to-gray-100 dark:from-gray-900/50 dark:via-gray-900/80 dark:to-gray-900" />
        </div>

        <div className="w-full flex justify-between items-center mb-6 px-1 relative z-10">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 p-2"
          >
            <FaBars size={18} />
          </button>
          <button
            type="button"
            aria-label={t.toggleTheme}
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 p-2"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="relative z-10 w-full flex flex-col flex-1 items-center">
          {navContent(!collapsed)}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
