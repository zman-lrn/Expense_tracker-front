import { createContext, useState, useEffect } from "react";
import { getBalance } from "../api/api";
export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getBalance();
      setBalance(res.data);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
