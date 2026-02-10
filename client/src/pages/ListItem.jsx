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
    const res = await api.get(`/get-items/${id}`);
    setItems(res.data.items);
    setListInfo(res.data.listInfo);
  };

  useEffect(() => { loadData(); }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    await api.post("/add-item", { listId: id, title: newItem });
    setNewItem("");
    loadData();
  };

  const deleteItem = async (itemId) => {
    await api.delete(`/delete-item/${itemId}`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl">

        <button onClick={() => navigate("/home")} className="text-gray-600 mb-4 hover:text-blue-600">← Back to lists</button>

        {listInfo && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{listInfo.title}</h1>
            <p className="text-gray-500">{listInfo.description}</p>
          </div>
        )}

        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input
            className="flex-1 border-b-2 border-gray-200 outline-none focus:border-blue-500 p-2 text-lg"
            placeholder="Add a task..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Add</button>
        </form>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="group flex items-center justify-between p-4 border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6 cursor-pointer" />
                <span>{item.title}</span>
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
