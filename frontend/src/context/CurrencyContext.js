import React, { createContext, useContext } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const selectedCurrency = "RON";
  
  // Amounts are stored and displayed in RON, so no conversion is needed
  const convert = (amount) => amount;

  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} lei`;
  };

  return (
    <CurrencyContext.Provider
      value={{ selectedCurrency, formatCurrency, convert }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
