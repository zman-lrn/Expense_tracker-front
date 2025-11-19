import { createContext, useState, useEffect } from "react";
import axios from "axios";

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
      const res = await axios.get("http://localhost:2225/api/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
