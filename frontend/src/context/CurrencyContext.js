import React, { createContext, useContext } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const selectedCurrency = "RON";
  
  const convert = (amount) => {
    // Simply return the amount as is since we're only using lei
    return amount;
  };

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
