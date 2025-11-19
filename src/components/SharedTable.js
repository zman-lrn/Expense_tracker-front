import React from "react";

const SharedEditableTable = ({
  data,
  paginatedData,
  categories,
  editingId,
  editData,
  handleEdit,
  handleEditChange,
  handleSave,
  handleCancel,
  handleDelete,
  categoryKey,
}) => {
  return (
    <>
      {data.length === 0 ? (
        <p>No records found</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Note</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td className="border px-2 py-1">
                      <select
                        name={categoryKey}
                        value={editData[categoryKey]}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>

                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        name="note"
                        value={editData.note}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>

                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        name="date"
                        value={editData.date}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>

                    <td className="border px-2 py-1 space-x-2">
                      <button
                        onClick={() => handleSave(item.id)}
                        className="px-2 py-1 bg-green-200 text-gray-700 rounded hover:bg-green-400"
                      >
                        Save
                      </button>

                      <button
                        onClick={handleCancel}
                        className="px-2 py-1 bg-red-100 text-gray-700 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-2 py-1">
                      {categories.find((c) => c.id === item[categoryKey])
                        ?.name || item.category_name}
                    </td>

                    <td className="border px-2 py-1">{item.amount}</td>

                    <td className="border px-2 py-1">{item.note}</td>

                    <td className="border px-2 py-1">
                      {new Date(item.date).toLocaleDateString()}
                    </td>

                    <td className="border px-2 py-1 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-2 py-1 bg-yellow-200 text-gray-700 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 bg-red-100 text-gray-700 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default SharedEditableTable;
