import React, { createContext, useContext, useMemo } from "react";

const CurrencyContext = createContext();

const formatter = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const CurrencyProvider = ({ children }) => {
  const selectedCurrency = "RON";

  const formatCurrency = useMemo(
    () => (amount) => {
      const n = Number(amount);
      return formatter.format(Number.isFinite(n) ? n : 0);
    },
    []
  );

  const convert = (amount) => amount;

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, formatCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
