import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import Loader from "../components/Loader";

const labels = {
  en: {
    settings: "Settings",
    language: "Language",
    logout: "Logout",
    redirect: "Redirecting to login...",
    theme: "Theme",
    avatar: "Avatar",
    dark: "Dark",
    light: "Light",
    savings: "Monthly savings goal",
    savingsHint: "Track how much you want to save each month",
    saveGoal: "Save goal",
    goalSaved: "Savings goal saved",
    goalError: "Could not save savings goal",
    change: "Change",
  },
  ro: {
    settings: "Setări",
    logout: "Deconectare",
    redirect: "Redirecționare către login...",
    language: "Limba",
    theme: "Temă",
    avatar: "Avatar",
    dark: "Întunecată",
    light: "Luminoasă",
    savings: "Țintă lunară de economii",
    savingsHint: "Cât vrei să economisești în fiecare lună",
    saveGoal: "Salvează ținta",
    goalSaved: "Ținta de economii a fost salvată",
    goalError: "Nu s-a putut salva ținta",
    change: "Schimbă",
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const { language: lang = "en", changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { formatCurrency } = useCurrency();
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "/avatar.png");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => navigate("/login"), 1000);
      setLoading(false);
      return;
    }

    const loadGoal = async () => {
      try {
        const res = await axios.get("/settings/savings-goal");
        setSavingsGoal(String(res.data.goal ?? 0));
      } catch {
        setSavingsGoal("0");
      } finally {
        setLoading(false);
      }
    };

    loadGoal();
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

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const res = await axios.post("/settings/savings-goal", {
        goal: Number(savingsGoal) || 0,
      });
      setSavingsGoal(String(res.data.goal ?? 0));
      setSuccess(res.data.msg || labels[lang].goalSaved);
    } catch (err) {
      setError(err.response?.data?.msg || labels[lang].goalError);
    } finally {
      setSaving(false);
    }
  };

  const inactiveBtn =
    "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";
  const activeBtn = "bg-emerald-600 text-white shadow-md";

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">
            {labels[lang].settings}
          </h2>
          {!localStorage.getItem("token") ? (
            <p className="text-gray-500 dark:text-gray-400 italic">{labels[lang].redirect}</p>
          ) : (
            <div className="w-full max-w-md bg-white/70 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl backdrop-blur p-6 sm:p-8 space-y-8">
              <div>
                <label className="block mb-2 font-semibold text-lg text-emerald-700 dark:text-emerald-300">
                  {labels[lang].language}
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => changeLanguage("en")}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      lang === "en" ? activeBtn : inactiveBtn
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLanguage("ro")}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      lang === "ro" ? activeBtn : inactiveBtn
                    }`}
                  >
                    Română
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-lg text-emerald-700 dark:text-emerald-300">
                  {labels[lang].theme}
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      isDarkMode ? activeBtn : inactiveBtn
                    }`}
                  >
                    {labels[lang].dark}
                  </button>
                  <button
                    type="button"
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      !isDarkMode ? activeBtn : inactiveBtn
                    }`}
                  >
                    {labels[lang].light}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveGoal} className="space-y-3">
                <label className="block font-semibold text-lg text-emerald-700 dark:text-emerald-300">
                  {labels[lang].savings}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {labels[lang].savingsHint}
                  {Number(savingsGoal) > 0
                    ? ` (${formatCurrency(Number(savingsGoal))})`
                    : ""}
                </p>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {labels[lang].saveGoal}
                </button>
              </form>

              <div>
                <label className="block mb-2 font-semibold text-lg text-emerald-700 dark:text-emerald-300">
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
                    {labels[lang].change}
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-300"
              >
                {labels[lang].logout}
              </button>
            </div>
          )}
          {error && (
            <div className="mt-4 max-w-md text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded p-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 max-w-md text-green-600 text-sm font-semibold bg-green-50 dark:bg-green-900/30 rounded p-2">
              {success}
            </div>
          )}
        </>
      )}
    </div>
  );
}
