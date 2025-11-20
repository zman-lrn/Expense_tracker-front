import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "https://expense-tracker-back-p908.onrender.com/api/";
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
  (req) => {
    req.headers["Content-Type"] = "application/json";

    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;

    return req;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Unauthorized. Please log in again.");
      localStorage.removeItem("token");
    } else if (status === 403) {
      toast.error("Access denied.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error("Something went wrong.");
    }

    return Promise.reject(error);
  }
);

export async function loginUser(data) {
  try {
    return await axios.post("/auth/login", data);
  } catch (error) {
    console.error("Login error:", error);
    return error.response || null;
  }
}

export async function registerUser(data) {
  try {
    return await axios.post("/auth/register", data);
  } catch (error) {
    console.error("Registration error:", error);
    return error.response || null;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function getCategories() {
  try {
    const response = await axios.get("/income-categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return error.response || null;
  }
}
export async function getIncome() {
  try {
    const response = await axios.get("/income");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return error.response || null;
  }
}

export async function submitIncome(data) {
  try {
    const response = await axios.post("/income", data);
    return response;
  } catch (error) {
    console.error("Error submitting income:", error);
    return error.response || null;
  }
}

export async function submitIncomeCategory(data) {
  try {
    const response = await axios.post("/income-categories", data);
    return response;
  } catch (error) {
    console.error("Error submitting income Category:", error);
    return error.response || null;
  }
}
export async function updateIncomeCategory(id, data) {
  try {
    const response = await axios.put(`/income-categories/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating income category:", error);
    return error.response || null;
  }
}
export async function deleteIncomeCategory(id, data) {
  try {
    const response = await axios.delete(`/income-categories/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error delete income category:", error);
    return error.response || null;
  }
}
export async function deleteIncome(id) {
  try {
    const response = await axios.delete(`/income/${id}`);
    return response;
  } catch (error) {
    console.error("Error delete income :", error);
    return error.response || null;
  }
}
export async function editIncome(id, data) {
  try {
    const response = await axios.put(`/income/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating income:", error);
    return error.response || null;
  }
}

export async function addExpense(data) {
  try {
    return await axios.post("/expenses", data);
  } catch (error) {
    console.error("Error adding expense:", error);
    return null;
  }
}

export async function getExpenses() {
  try {
    return await axios.get("/expenses");
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }
}
export async function getExpensesCategories() {
  try {
    return await axios.get("/expense-categories");
  } catch (error) {
    console.error("Error fetching expenses categories:", error);
    return null;
  }
}
export async function submitExpenseCategory(data) {
  try {
    const response = await axios.post("/expense-categories", data);
    return response;
  } catch (error) {
    console.error("Error submitting expense Category:", error);
    return error.response || null;
  }
}
export async function updateExpenseCategory(id, data) {
  try {
    const response = await axios.put(`/expense-categories/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating income category:", error);
    return error.response || null;
  }
}
export async function deleteExpenseCategory(id) {
  try {
    const response = await axios.delete(`/expense-categories/${id}`);
    return response;
  } catch (error) {
    console.error("Error delete Expense category:", error);
    return error.response || null;
  }
}
export async function deleteExpense(id) {
  try {
    const response = await axios.delete(`/expenses/${id}`);
    return response;
  } catch (error) {
    console.error("Error delete Expense :", error);
    return error.response || null;
  }
}
export async function editExpense(id, data) {
  try {
    const response = await axios.put(`/expenses/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating income:", error);
    return error.response || null;
  }
}

export default axios;
