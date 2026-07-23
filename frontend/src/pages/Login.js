import React, { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

const t = {
  en: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    placeholderEmail: "you@example.com",
    placeholderPassword: "••••••••",
    signIn: "Sign in",
    createAccount: "Create Account",
    switchToRegister: "Don't have an account? Register here",
    switchToLogin: "Already have an account? Sign in",
    errorLogin: "Invalid credentials",
    errorRegister: "Registration failed",
    loadingLogin: "Signing in...",
    loadingRegister: "Registering..."
  },
  ro: {
    login: "Autentificare",
    register: "Înregistrare",
    email: "Email",
    password: "Parolă",
    placeholderEmail: "tu@exemplu.com",
    placeholderPassword: "••••••••",
    signIn: "Intră",
    createAccount: "Creează Cont",
    switchToRegister: "Nu ai cont? Creează unul aici",
    switchToLogin: "Ai deja cont? Intră aici",
    errorLogin: "Date incorecte",
    errorRegister: "Înregistrarea a eșuat",
    loadingLogin: "Se autentifică...",
    loadingRegister: "Se înregistrează..."
  }
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState("login");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (mode === "register") {
      if (formData.password.length < 6) {
        setError(
          language === "ro"
            ? "Parola trebuie să aibă cel puțin 6 caractere"
            : "Password must be at least 6 characters"
        );
        setLoading(false);
        return;
      }
      if (formData.password !== confirmPassword) {
        setError(language === "ro" ? "Parolele nu coincid" : "Passwords do not match");
        setLoading(false);
        return;
      }
    }
    try {
      if (mode === "login") {
        const res = await axios.post("/auth/login", formData);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        const res = await axios.post("/auth/register", formData);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (mode === "login" ? t[language].errorLogin : t[language].errorRegister)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-[#132e1e] to-black text-gray-100 px-4 font-sans">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button
          onClick={() => changeLanguage("en")}
          className={`px-4 py-2 rounded-full font-semibold border transition-all duration-200 ${language === "en" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-emerald-700 hover:text-white"}`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("ro")}
          className={`px-4 py-2 rounded-full font-semibold border transition-all duration-200 ${language === "ro" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-emerald-700 hover:text-white"}`}
        >
          Română
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f0f0f] w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in border border-emerald-700 mt-20 sm:mt-0"
      >
        <h2 className="text-4xl font-bold text-center mb-2 text-emerald-400">
          {mode === "login" ? "🔐 " + t[language].login : "📝 " + t[language].register}
        </h2>
        {error && <p className="text-red-400 text-sm text-center">❌ {error}</p>}

        <div className="space-y-1">
          <label className="text-sm font-medium">{t[language].email}</label>
          <input
            type="email"
            name="email"
            placeholder={t[language].placeholderEmail}
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-emerald-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1 relative">
          <label className="text-sm font-medium">{t[language].password}</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t[language].placeholderPassword}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={mode === "register" ? 6 : undefined}
            className="w-full px-4 py-2 bg-gray-800 border border-emerald-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {mode === "register" && (
          <div className="space-y-1 relative">
            <label className="text-sm font-medium">{language === "ro" ? "Confirmă parola" : "Confirm password"}</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={language === "ro" ? "Confirmă parola" : "Confirm password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-800 border border-emerald-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-white"
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
          {loading
            ? <><Loader2 className="animate-spin w-5 h-5" /> {mode === "login" ? t[language].loadingLogin : t[language].loadingRegister}</>
            : mode === "login"
            ? t[language].signIn
            : t[language].createAccount}
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          {mode === "login" ? (
            <>
              {t[language].switchToRegister} {" "}
              <button
                type="button"
                className="text-green-400 hover:underline ml-1"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                {t[language].register}
              </button>
            </>
          ) : (
            <>
              {t[language].switchToLogin} {" "}
              <button
                type="button"
                className="text-green-400 hover:underline ml-1"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
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
