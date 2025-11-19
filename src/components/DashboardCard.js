import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getExpenses, getIncome } from "../api/api";

const Dashboard = () => {
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [allIncomes, setAllIncomes] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA336A",
    "#BB6677",
    "#33AA99",
  ];

  const groupByCategory = (items) => {
    const grouped = items.reduce((acc, curr) => {
      const category = curr.category_name || "Uncategorized";
      acc[category] = (acc[category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseRes = await getExpenses();
        const fetchedExpenses = Array.isArray(expenseRes.data)
          ? expenseRes.data
          : expenseRes.data.expenses || [];

        setAllExpenses(fetchedExpenses);
        setExpenseData(groupByCategory(fetchedExpenses));

        const incomeRes = await getIncome();
        const fetchedIncomes = Array.isArray(incomeRes.data)
          ? incomeRes.data
          : incomeRes.data.incomes || [];

        setAllIncomes(fetchedIncomes);
        setIncomeData(groupByCategory(fetchedIncomes));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      const filteredExpenses = allExpenses.filter((exp) => {
        const date = new Date(exp.date);
        return date >= start && date <= end;
      });

      const filteredIncomes = allIncomes.filter((inc) => {
        const date = new Date(inc.date);
        return date >= start && date <= end;
      });

      setExpenseData(groupByCategory(filteredExpenses));
      setIncomeData(groupByCategory(filteredIncomes));
    } else {
      setExpenseData(groupByCategory(allExpenses));
      setIncomeData(groupByCategory(allIncomes));
    }
  }, [fromDate, toDate, allExpenses, allIncomes]);

  return (
    <div className="p-6 z-0">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="flex gap-4 mb-6">
        <div className="m-auto">
          <label className="block font-semibold mb-1">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div className="m-auto">
          <label className="block font-semibold mb-1">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-2 flex flex-col justify-center rounded-lg items-center">
        <h3 className="text-xl font-semibold mb-4 text-black text-center">
          Expenses by Category
        </h3>
        {expenseData.length > 0 ? (
          <PieChart width={400} height={400}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p className="text-gray-600 text-center">
            No expense data available.
          </p>
        )}
      </div>

      <div className="bg-gray-100 p-2 flex flex-col justify-center rounded-lg items-center mt-6 z-0 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-black text-center">
          Incomes by Category
        </h3>
        {incomeData.length > 0 ? (
          <PieChart width={400} height={400}>
            <Pie
              data={incomeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {incomeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p className="text-gray-600 text-center">No income data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
