import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

function ListItem() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // States para sa pag-edit ng task
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemTitle, setEditingItemTitle] = useState("");

  const loadItems = async () => {
    try {
      const res = await api.get(`/get-items/${listId}`);
      // Naka-sync sa server.js mo: res.json({ items: items.rows, listInfo: listInfo.rows[0] });
      setItems(res.data.items || []);
      setListTitle(res.data.listInfo?.title || "Board");
    } catch (err) {
      console.error("Error loading items:", err);
    }
  };

  useEffect(() => { loadItems(); }, [listId]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      await api.post("/add-item", { 
        listId: listId, 
        title: newItem 
      });
      setNewItem("");
      loadItems();
      setMessage({ text: "Task Added!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessage({ text: "Failed to add", type: "error" });
    }
  };

  const saveEditItem = async (itemId) => {
    if (!editingItemTitle.trim()) return setEditingItemId(null);
    try {
      // Naka-sync sa app.put("/edit-item/:id") ng server.js mo
      await api.put(`/edit-item/${itemId}`, { title: editingItemTitle });
      setEditingItemId(null);
      loadItems();
      setMessage({ text: "Task Updated!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/delete-item/${id}`);
      loadItems();
      setMessage({ text: "Task Deleted", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12 font-sans text-slate-900">
      
      {/* FLOATING NOTIFICATION */}
      {message.text && (
        <div className="fixed top-10 z-[100] animate-in slide-in-from-top-5 duration-300 px-8 py-4 rounded-[2rem] shadow-2xl bg-indigo-600 text-white font-bold flex items-center gap-3">
          <span>✨</span> {message.text}
        </div>
      )}

      {/* HEADER */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate("/home")} 
          className="px-5 py-2 bg-white border border-slate-100 rounded-xl font-bold text-slate-500 hover:text-indigo-600 shadow-sm transition-all"
        >
          ← Back
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-black text-indigo-600 tracking-tighter">{listTitle}</h1>
          <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">Task Management</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-white">
        <form onSubmit={addItem} className="flex gap-3 mb-10">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-lg"
            placeholder="What needs to be done?"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
            Add
          </button>
        </form>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-10 text-slate-300 italic">No tasks yet.</div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="group flex justify-between items-center p-5 bg-white border border-slate-50 rounded-[1.5rem] hover:border-indigo-100 hover:shadow-sm transition-all">
                <div className="flex-1">
                  {editingItemId === i.id ? (
                    <input
                      autoFocus
                      value={editingItemTitle}
                      onChange={(e) => setEditingItemTitle(e.target.value)}
                      onBlur={() => saveEditItem(i.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEditItem(i.id)}
                      className="text-lg font-bold text-indigo-600 outline-none w-full bg-indigo-50 px-2 rounded-lg"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-700">{i.title}</span>
                  )}
                </div>

                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingItemId(i.id); setEditingItemTitle(i.title); }}
                    className="text-slate-300 hover:text-indigo-600 font-bold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(i.id)}
                    className="text-slate-300 hover:text-rose-500 font-bold transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ListItem;