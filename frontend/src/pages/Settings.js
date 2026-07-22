import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader";

const labels = {
  en: {
    settings: "⚙️ Settings",
    language: "🌍 Language",
    logout: "🚪 Logout",
    redirect: "Redirecting to login...",
    theme: "🌓 Theme",
    avatar: "🖼️ Avatar",
    dark: "Dark",
    light: "Light",
  },
  ro: {
    settings: "⚙️ Setări",
    language: "🌍 Limba",
    logout: "🚪 Deconectare",
    redirect: "Redirecționare către login...",
    theme: "🌓 Temă",
    avatar: "🖼️ Avatar",
    dark: "Întunecată",
    light: "Luminoasă",
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const { language: lang = "en", changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "/avatar.png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) setTimeout(() => navigate("/login"), 1000);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">⚙️ {labels[lang].settings}</h2>
          {!localStorage.getItem("token") ? (
            <p className="text-gray-400 italic">{labels[lang].redirect}</p>
          ) : (
            <div className="w-full max-w-md bg-gray-800/30 border border-gray-700 rounded-3xl shadow-xl backdrop-blur p-8 space-y-8 transition-all">
              {/* Language section */}
              <div>
                <label className="block mb-2 font-semibold text-lg text-emerald-300">
                  {labels[lang].language}
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      lang === "en"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("ro")}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      lang === "ro"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Română
                  </button>
                </div>
              </div>

              {/* Theme section */}
              <div>
                <label className="block mb-2 font-semibold text-lg text-emerald-300">
                  {labels[lang].theme}
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {labels[lang].dark}
                  </button>
                  <button
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      !isDarkMode
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {labels[lang].light}
                  </button>
                </div>
              </div>

              {/* Avatar section */}
              <div>
                <label className="block mb-2 font-semibold text-lg text-emerald-300">
                  {labels[lang].avatar}
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label
                    htmlFor="avatar-input"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl cursor-pointer hover:bg-emerald-700 transition-colors duration-300"
                  >
                    Change
                  </label>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-300"
              >
                {labels[lang].logout}
              </button>
            </div>
          )}
          {error && <div className="mt-2 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded p-2">{error}</div>}
          {success && <div className="mt-2 text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-900/30 rounded p-2">{success}</div>}
        </>
      )}
    </div>
  );
}
