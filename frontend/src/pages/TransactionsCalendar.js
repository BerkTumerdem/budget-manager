import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "../utils/axiosConfig";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";

const translations = {
  en: {
    title: "📅 Calendar",
    noTransactions: "No transactions found.",
    onDate: "📌 Transactions on",
    category: "📂 Category",
    noDesc: "No description",
  },
  ro: {
    title: "📅 Calendar",
    noTransactions: "Nicio tranzacție găsită.",
    onDate: "📌 Tranzacții pe",
    category: "📂 Categorie",
    noDesc: "Fără descriere",
  },
};

export default function TransactionsCalendar() {
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [hoveredDay, setHoveredDay] = useState(null);
  const calendarRef = useRef();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await axios.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const getTotalForDate = (date) => {
    const day = date.toISOString().split("T")[0];
    const total = transactions
      .filter((t) => t.date.startsWith(day))
      .reduce((acc, t) => {
        return t.type === "income" ? acc + t.amount : acc - t.amount;
      }, 0);

    return total === 0 ? null : `${total > 0 ? "+" : "-"}${Math.abs(total).toFixed(2)} lei`;
  };

  const getDaySummary = (date) => {
    const day = date.toISOString().split("T")[0];
    let income = 0, expense = 0;
    transactions.filter((t) => t.date.startsWith(day)).forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return { income, expense };
  };

  const getTransactionCountForDate = (date) => {
    const day = date.toISOString().split("T")[0];
    return transactions.filter((t) => t.date.startsWith(day)).length;
  };

  const handleDateClick = (date) => {
    const day = date.toISOString().split("T")[0];
    const list = transactions.filter((t) => t.date.startsWith(day));
    setFiltered(list);
    setSelectedDate(day);
  };

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white' : 'bg-white text-gray-900'} font-sans`}>
      <h2 className={`text-3xl font-bold mb-10 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{translations[language].title}</h2>

      <div className="flex flex-col lg:flex-row gap-10 justify-center items-start">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-3xl shadow-xl hover:shadow-emerald-500 transition-all`}>
          <Calendar
            onClickDay={handleDateClick}
            tileContent={({ date }) => {
              const count = getTransactionCountForDate(date);
              const day = date.toISOString().split("T")[0];
              return (
                <div
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {count > 0 && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                  {hoveredDay === day && count > 0 && (
                    <div className="absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-emerald-400 rounded-xl shadow-lg p-3 min-w-[220px] max-w-xs text-xs text-gray-900 dark:text-white animate-fade-in">
                      <div className="mb-1 font-bold">{day}</div>
                      {(() => {
                        const filtered = transactions.filter((t) => t.date.startsWith(day));
                        const total = filtered.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);
                        return (
                          <>
                            <div className="mb-1">
                              <span className={total >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {total >= 0 ? '+' : '-'}{Math.abs(total).toFixed(2)} lei
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {filtered.map((t) => (
                                <li key={t._id} className="flex items-center gap-2">
                                  <span className={`inline-block w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                  <span className="font-semibold">{t.type === 'income' ? '+' : '-'}{t.amount}</span>
                                  <span className="truncate">{t.description || 'No desc'}</span>
                                  {t.category && (
                                    <span className="ml-1 px-1 rounded bg-emerald-100 text-emerald-700 text-[10px]">{t.category.name}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            }}
            tileClassName={({ date }) =>
              date.toDateString() === new Date().toDateString()
                ? "!bg-emerald-100 dark:!bg-emerald-900/40 !border-emerald-400"
                : undefined
            }
            className={`react-calendar !w-[340px] !h-[360px] rounded-xl text-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            ref={calendarRef}
          />
        </div>

        <div className="flex-1">
          {selectedDate && (
            <>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{translations[language].onDate} {selectedDate}</h3>
              {/* Day summary */}
              <div className="flex gap-4 mb-4">
                {(() => { const { income, expense } = getDaySummary(new Date(selectedDate));
                  return (
                    <>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs font-bold">
                        <svg width="14" height="14" fill="currentColor" className="inline"><path d="M7 13V1m0 0l-3.5 3.5M7 1l3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        +{formatCurrency(income)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs font-bold">
                        <svg width="14" height="14" fill="currentColor" className="inline"><path d="M7 1v12m0 0l-3.5-3.5M7 13l3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        -{formatCurrency(expense)}
                      </span>
                    </>
                  );
                })()}
              </div>
              <ul className="space-y-4">
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <li
                      key={t._id}
                      className={`p-4 flex items-center gap-4 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-2xl shadow hover:scale-[1.01] transition`}
                    >
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${t.type === "income" ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                        {t.type === "income" ? '+' : '-'}
                      </span>
                      <div className="flex-1">
                        <p className="mb-1 text-base">
                          <span className="font-bold">
                            {formatCurrency(t.amount)}
                          </span>{" "}
                          — {t.description || translations[language].noDesc}
                        </p>
                        {t.category && (
                          <span className={`inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold mr-2`}>
                            {t.category.name}
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>{translations[language].noTransactions}</p>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
