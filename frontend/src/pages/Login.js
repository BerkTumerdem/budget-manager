import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

const t = {
  en: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    placeholderEmail: "you@example.com",
    placeholderPassword: "••••••••",
    signIn: "Sign in",
    createAccount: "Create Account",
    switchToRegister: "Don't have an account?",
    switchToLogin: "Already have an account?",
    errorLogin: "Invalid credentials",
    errorRegister: "Registration failed",
    passwordShort: "Password must be at least 6 characters",
    passwordMismatch: "Passwords do not match",
    loadingLogin: "Signing in...",
    loadingRegister: "Registering...",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  ro: {
    login: "Autentificare",
    register: "Înregistrare",
    email: "Email",
    password: "Parolă",
    confirmPassword: "Confirmă parola",
    placeholderEmail: "tu@exemplu.com",
    placeholderPassword: "••••••••",
    signIn: "Intră",
    createAccount: "Creează Cont",
    switchToRegister: "Nu ai cont?",
    switchToLogin: "Ai deja cont?",
    errorLogin: "Date incorecte",
    errorRegister: "Înregistrarea a eșuat",
    passwordShort: "Parola trebuie să aibă cel puțin 6 caractere",
    passwordMismatch: "Parolele nu coincid",
    loadingLogin: "Se autentifică...",
    loadingRegister: "Se înregistrează...",
    showPassword: "Arată parola",
    hidePassword: "Ascunde parola",
  },
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const mode = location.pathname.startsWith("/register") ? "register" : "login";

  useEffect(() => {
    setError("");
    setConfirmPassword("");
  }, [mode]);

  const switchMode = (next) => {
    setError("");
    navigate(next === "register" ? "/register" : "/login");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (mode === "register") {
      if (formData.password.length < 6) {
        setError(t[language].passwordShort);
        setLoading(false);
        return;
      }
      if (formData.password !== confirmPassword) {
        setError(t[language].passwordMismatch);
        setLoading(false);
        return;
      }
    }
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const res = await axios.post(endpoint, formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (mode === "login" ? t[language].errorLogin : t[language].errorRegister)
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-emerald-700 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  const langBtn = (active) =>
    `px-4 py-2 rounded-full font-semibold border transition-all duration-200 ${
      active
        ? "bg-emerald-600 text-white border-emerald-700 shadow"
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
    }`;

  return (
    <div className="flex items-center justify-center min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/40 text-gray-900 dark:text-gray-100 px-4 font-sans transition-colors">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 z-20 px-2">
        <button type="button" onClick={() => changeLanguage("en")} className={langBtn(language === "en")}>
          English
        </button>
        <button type="button" onClick={() => changeLanguage("ro")} className={langBtn(language === "ro")}>
          Română
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className={langBtn(false)}
          aria-label={isDarkMode ? "Light mode" : "Dark mode"}
        >
          {isDarkMode ? "Light" : "Dark"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/90 dark:bg-gray-900/90 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-gray-200 dark:border-emerald-800/60 mt-24 sm:mt-16 backdrop-blur"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-emerald-700 dark:text-emerald-400">
          {mode === "login" ? t[language].login : t[language].register}
        </h2>
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium bg-red-50 dark:bg-red-900/30 rounded-lg p-2">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="auth-email" className="text-sm font-medium">
            {t[language].email}
          </label>
          <input
            id="auth-email"
            type="email"
            name="email"
            placeholder={t[language].placeholderEmail}
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div className="space-y-1 relative">
          <label htmlFor="auth-password" className="text-sm font-medium">
            {t[language].password}
          </label>
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t[language].placeholderPassword}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={mode === "register" ? 6 : undefined}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t[language].hidePassword : t[language].showPassword}
            className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {mode === "register" && (
          <div className="space-y-1 relative">
            <label htmlFor="auth-confirm" className="text-sm font-medium">
              {t[language].confirmPassword}
            </label>
            <input
              id="auth-confirm"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={t[language].confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? t[language].hidePassword : t[language].showPassword}
              className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-semibold shadow transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              {mode === "login" ? t[language].loadingLogin : t[language].loadingRegister}
            </>
          ) : mode === "login" ? (
            t[language].signIn
          ) : (
            t[language].createAccount
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === "login" ? (
            <>
              {t[language].switchToRegister}{" "}
              <button
                type="button"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                onClick={() => switchMode("register")}
              >
                {t[language].register}
              </button>
            </>
          ) : (
            <>
              {t[language].switchToLogin}{" "}
              <button
                type="button"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                onClick={() => switchMode("login")}
              >
                {t[language].login}
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
