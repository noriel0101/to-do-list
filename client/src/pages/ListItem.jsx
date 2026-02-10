import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [listInfo, setListInfo] = useState(null);
  const [newItem, setNewItem] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get(`/get-items/${id}`);

      if (res.data.success) {
        setItems(res.data.items);
        setListInfo(res.data.listInfo);
      }
    } catch (err) {
      console.error("Load items error", err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      await api.post("/add-item", {
        listId: id,
        title: newItem
      });

      setNewItem("");
      loadData();
    } catch (err) {
      console.error("Add item error", err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/delete-item/${itemId}`);
      loadData();
    } catch (err) {
      console.error("Delete item error", err);
    }
  };

  const toggleStatus = async (item) => {
    try {
      const newStatus =
        item.status === "done" ? "pending" : "done";

      await api.put(`/edit-item/${item.id}`, {
        title: item.title,
        status: newStatus
      });

      loadData();
    } catch (err) {
      console.error("Update status error", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/home")}
          className="text-gray-400 mb-6 hover:text-blue-600"
        >
          ← Back to lists
        </button>

        {listInfo && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold">{listInfo.title}</h1>
            <p className="text-gray-500 text-lg">
              {listInfo.description}
            </p>
          </div>
        )}

        <form onSubmit={addItem} className="flex gap-2 mb-8">
          <input
            className="flex-1 border-b-2 border-gray-200 outline-none focus:border-blue-500 p-2 text-lg"
            placeholder="Add a task..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">
            Add
          </button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-5 border border-gray-100 rounded-2xl shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded-md mr-4 cursor-pointer"
                  checked={item.status === "done"}
                  onChange={() => toggleStatus(item)}
                />

                <span
                  className={`text-lg ${
                    item.status === "done"
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {item.title}
                </span>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListItem;
