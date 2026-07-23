import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "../utils/axiosConfig";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { toLocalDateKey } from "../utils/date";
import Loader from "../components/Loader";

const translations = {
  en: {
    title: "Calendar",
    noTransactions: "No transactions found.",
    onDate: "Transactions on",
    noDesc: "No description",
    fetchError: "Could not load transactions.",
  },
  ro: {
    title: "Calendar",
    noTransactions: "Nicio tranzacție găsită.",
    onDate: "Tranzacții pe",
    noDesc: "Fără descriere",
    fetchError: "Nu s-au putut încărca tranzacțiile.",
  },
};

export default function TransactionsCalendar() {
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/expenses");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(translations[language].fetchError);
    } finally {
      setLoading(false);
    }
  };

  const matchesDay = (tx, day) => {
    if (!tx.date) return false;
    return toLocalDateKey(tx.date) === day || String(tx.date).startsWith(day);
  };

  const getDaySummary = (date) => {
    const day = toLocalDateKey(date);
    let income = 0;
    let expense = 0;
    transactions.filter((tx) => matchesDay(tx, day)).forEach((tx) => {
      if (tx.type === "income") income += tx.amount;
      else expense += tx.amount;
    });
    return { income, expense };
  };

  const getTransactionCountForDate = (date) => {
    const day = toLocalDateKey(date);
    return transactions.filter((tx) => matchesDay(tx, day)).length;
  };

  const handleDateClick = (date) => {
    const day = toLocalDateKey(date);
    const list = transactions.filter((tx) => matchesDay(tx, day));
    setFiltered(list);
    setSelectedDate(day);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen overflow-x-hidden bg-transparent text-gray-900 dark:text-white font-sans">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-emerald-600 dark:text-emerald-400">
        {translations[language].title}
      </h2>

      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 text-sm font-semibold bg-red-50 dark:bg-red-900/30 rounded-xl p-3">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-center items-stretch lg:items-start w-full">
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 sm:p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-full lg:max-w-md mx-auto">
          <Calendar
            onClickDay={handleDateClick}
            tileContent={({ date }) => {
              const count = getTransactionCountForDate(date);
              const day = toLocalDateKey(date);
              return (
                <div
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {count > 0 && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                  {hoveredDay === day && count > 0 && (
                    <div className="absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-emerald-400 rounded-xl shadow-lg p-3 min-w-[180px] max-w-[min(16rem,90vw)] text-xs text-gray-900 dark:text-white hidden sm:block">
                      <div className="mb-1 font-bold">{day}</div>
                      {(() => {
                        const dayTx = transactions.filter((tx) => matchesDay(tx, day));
                        const total = dayTx.reduce(
                          (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
                          0
                        );
                        return (
                          <>
                            <div className="mb-1">
                              <span className={total >= 0 ? "text-green-600" : "text-red-600"}>
                                {total >= 0 ? "+" : "-"}
                                {formatCurrency(Math.abs(total))}
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {dayTx.map((tx) => (
                                <li key={tx._id} className="flex items-center gap-2">
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full ${
                                      tx.type === "income" ? "bg-green-400" : "bg-red-400"
                                    }`}
                                  />
                                  <span className="font-semibold">
                                    {tx.type === "income" ? "+" : "-"}
                                    {formatCurrency(tx.amount)}
                                  </span>
                                  <span className="truncate">
                                    {tx.description || translations[language].noDesc}
                                  </span>
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
            className="react-calendar !w-full !max-w-[100%] rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex-1 w-full min-w-0">
          {selectedDate && (
            <>
              <h3 className="text-xl font-semibold mb-2 text-emerald-600 dark:text-emerald-300">
                {translations[language].onDate} {selectedDate}
              </h3>
              <div className="flex gap-4 mb-4 flex-wrap">
                {(() => {
                  const { income, expense } = getDaySummary(new Date(`${selectedDate}T12:00:00`));
                  return (
                    <>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs font-bold">
                        +{formatCurrency(income)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs font-bold">
                        -{formatCurrency(expense)}
                      </span>
                    </>
                  );
                })()}
              </div>
              <ul className="space-y-4">
                {filtered.length > 0 ? (
                  filtered.map((tx) => (
                    <li
                      key={tx._id}
                      className="p-4 flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow"
                    >
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="mb-1 text-base">
                          <span className="font-bold">{formatCurrency(tx.amount)}</span>
                          {" — "}
                          {tx.description || translations[language].noDesc}
                        </p>
                        {tx.category && (
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold">
                            {tx.category.name}
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    {translations[language].noTransactions}
                  </p>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
