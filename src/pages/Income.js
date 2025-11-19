import { BalanceContext } from "../context/BalanceContext";
import { useState, useEffect, useContext } from "react";
import IncomeForm from "../components/IncomeForm";
import SharedEditableTable from "../components/SharedTable";
import {
  getCategories,
  getIncome,
  submitIncome,
  submitIncomeCategory,
  updateIncomeCategory,
  deleteIncomeCategory,
  deleteIncome,
  editIncome,
} from "../api/api";

const Income = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const { fetchBalance } = useContext(BalanceContext);
  const [formData, setFormData] = useState({
    income_category_id: "",
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
    fetchIncomes();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();

      const fetched = Array.isArray(res.data.categories)
        ? res.data.categories
        : Array.isArray(res.data)
        ? res.data
        : [];
      setCategories(fetched);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchIncomes = async () => {
    try {
      const res = await getIncome();
      const formattedData = res.data.map((item) => ({
        ...item,
        date: formatDate(item.date),
      }));
      setIncomes(formattedData);
    } catch (err) {
      console.error("Failed to fetch incomes:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.value === "add_new") {
      setShowAddCategoryModal(true);
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitIncome(formData);

      fetchIncomes();
      fetchBalance();

      setFormData({
        income_category_id: "",
        amount: "",
        note: "",
        date: "",
      });
    } catch (err) {
      console.error("Failed to add income:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await submitIncomeCategory({ name: newCategoryName });
      setShowAddCategoryModal(false);
      setNewCategoryName("");
      await fetchCategories();
      setFormData((prev) => ({
        ...prev,
        income_category_id: res.data.id,
      }));
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleEditCategory = async (id, newName) => {
    try {
      await await updateIncomeCategory(id, { name: newName });
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteIncomeCategory(id);

      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);
      fetchIncomes();
      fetchBalance();
    } catch (err) {
      console.error("Failed to delete income:", err);
    }
  };

  const handleEdit = (income) => {
    setEditingId(income.id);
    setEditData({
      income_category_id: income.income_category_id,
      amount: income.amount,
      note: income.note,
      date: income.date,
    });
    fetchBalance();
  };

  const handleSave = async (id) => {
    try {
      await editIncome(id, editData);
      fetchIncomes();
      setEditingId(null);
      setEditData({});
      fetchBalance();
    } catch (err) {
      console.error("Failed to update income:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(incomes.length / ITEMS_PER_PAGE);
  const paginatedIncomes = incomes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Income</h2>
      <IncomeForm
        categories={categories}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {showAddCategoryModal && (
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
                  className="px-3 py-2 bg-green-700 text-white rounded hover:bg-blue-700"
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
                        className="ml-2 px-2 py-1 bg-red-400 text-gray-700 text-sm rounded hover:bg-red-600"
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
                onClick={() => setShowAddCategoryModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mb-2">Existing Incomes</h3>
      {incomes.length === 0 ? (
        <p>No incomes yet</p>
      ) : (
        <>
          <SharedEditableTable
            data={incomes}
            paginatedData={paginatedIncomes}
            categories={categories}
            editingId={editingId}
            editData={editData}
            handleEdit={handleEdit}
            handleEditChange={handleEditChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleDelete={handleDelete}
            categoryKey="income_category_id"
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

export default Income;
