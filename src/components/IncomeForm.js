import React from "react";

const IncomeForm = ({ categories, formData, onChange, onSubmit }) => {
  return (
    <form className="space-y-4 mb-8" onSubmit={onSubmit}>
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          name="income_category_id"
          value={formData.income_category_id}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}

          <option value="add_new">➕ Add new category</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Note</label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Income
      </button>
    </form>
  );
};

export default IncomeForm;
