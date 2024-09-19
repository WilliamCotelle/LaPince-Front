import React, { createContext, useState, useContext, useEffect } from "react";

const BankContext = createContext();

export const BankProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(() => {
    // Charger l'ID du compte depuis localStorage s'il existe
    const storedAccount = localStorage.getItem("selectedAccount");
    return storedAccount ? storedAccount : "";
  });

  useEffect(() => {
    // Sauvegarder l'ID du compte sélectionné dans localStorage
    if (selectedAccount) {
      localStorage.setItem("selectedAccount", selectedAccount);
    }
  }, [selectedAccount]);

  return (
    <BankContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBankContext = () => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error("useBankContext must be used within a BankProvider");
  }
  return context;
};
