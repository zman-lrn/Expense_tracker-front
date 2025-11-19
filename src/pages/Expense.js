import { useState, useEffect, useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import {
  getExpensesCategories,
  getExpenses,
  addExpense,
  submitExpenseCategory,
  deleteExpense,
  editExpense,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../api/api";
import ExpenseForm from "../components/ExpenseForm";
import SharedEditableTable from "../components/SharedTable";
const Expense = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { fetchBalance } = useContext(BalanceContext);
  const [formData, setFormData] = useState({
    expense_category_id: "",
    amount: "",
    note: "",
    date: "",
  });
  const formatDate = (iso) => {
    const d = new Date(iso);

    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0") +
      " " +
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0") +
      ":" +
      String(d.getSeconds()).padStart(2, "0")
    );
  };
  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getExpensesCategories();
      const fetched = Array.isArray(res.data.categories)
        ? res.data.categories
        : [];
      setCategories(fetched);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses();
      const formattedData = res.data.map((item) => ({
        ...item,
        date: formatDate(item.date),
      }));
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setShowCategoryModal(true);
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(formData);
      fetchExpenses();
      fetchBalance();
      setFormData({ expense_category_id: "", amount: "", note: "", date: "" });
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await submitExpenseCategory({ name: newCategoryName });
      setShowCategoryModal(false);
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
      fetchBalance();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      expense_category_id: expense.expense_category_id,
      amount: expense.amount,
      note: expense.note,
      date: expense.date,
    });
  };

  const handleSave = async (id) => {
    try {
      await editExpense(id, editData);
      fetchExpenses();
      setEditingId(null);
      setEditData({});
      fetchBalance();
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };
  const handleEditCategory = async (id, newName) => {
    try {
      await updateExpenseCategory(id, { name: newName });
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    // if (!window.confirm("Delete this category?")) return;
    try {
      await deleteExpenseCategory(id);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <ExpenseForm
        categories={categories}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Manage Categories</h3>

            <form onSubmit={handleAddCategory} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-3 py-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-red-400 text-white rounded hover:bg-red-700"
                >
                  Add
                </button>
              </div>
            </form>

            <div>
              <h4 className="font-medium mb-2">Your Categories</h4>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">No categories yet.</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between border px-3 py-2 rounded"
                    >
                      <input
                        type="text"
                        defaultValue={cat.name}
                        onBlur={(e) =>
                          e.target.value.trim() !== cat.name &&
                          handleEditCategory(cat.id, e.target.value.trim())
                        }
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="ml-2 px-2 py-1 bg-red-300 text-gray-700 text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mb-2">Existing Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <>
          <SharedEditableTable
            data={expenses}
            paginatedData={paginatedExpenses}
            categories={categories}
            editingId={editingId}
            editData={editData}
            handleEdit={handleEdit}
            handleEditChange={handleEditChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleDelete={handleDelete}
            categoryKey="expense_category_id"
          />

          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Expense;
