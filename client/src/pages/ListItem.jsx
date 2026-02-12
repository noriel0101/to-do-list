import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [listInfo, setListInfo] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // MGA BAGONG STATE PARA SA EDIT
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const loadItems = async () => {
    try {
      const res = await api.get(`/get-items/${id}`);
      setItems(res.data.items);
      setListInfo(res.data.listInfo);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
      else setMessage({ text: "Failed to load tasks", type: "error" });
    }
  };

  useEffect(() => { loadItems(); }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    try {
      await api.post("/add-item", { listId: id, title: newItem });
      setNewItem("");
      loadItems();
    } catch { setMessage({ text: "Failed to add task", type: "error" }); }
  };

  const saveEditItem = async (itemId) => {
    try {
      await api.put(`/edit-item/${itemId}`, { title: editingTitle });
      setEditingId(null);
      loadItems();
    } catch { setMessage({ text: "Failed to update task", type: "error" }); }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/delete-item/${itemId}`);
      loadItems();
    } catch { setMessage({ text: "Failed to delete task", type: "error" }); }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
        <button onClick={() => navigate("/home")} className="text-gray-400 mb-4 hover:text-pink-600">← Back</button>
        
        {listInfo && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{listInfo.title}</h1>
          </div>
        )}

        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add task..." className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300" />
          <button className="px-5 py-2 bg-pink-500 text-white rounded-xl font-semibold">Add</button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-white shadow">
              <div className="flex-1">
                {editingId === item.id ? (
                  <input 
                    value={editingTitle} 
                    onChange={(e) => setEditingTitle(e.target.value)} 
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  <span className="text-gray-700">{item.title}</span>
                )}
              </div>
              
              <div className="flex gap-3 ml-4">
                {editingId === item.id ? (
                  <button onClick={() => saveEditItem(item.id)} className="text-green-600 font-semibold">Save</button>
                ) : (
                  <button onClick={() => { setEditingId(item.id); setEditingTitle(item.title); }} className="text-indigo-600 font-semibold">Edit</button>
                )}
                <button onClick={() => deleteItem(item.id)} className="text-red-500 font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListItem;