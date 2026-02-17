import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

function ListItem() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // States para sa Custom Delete Modal (Task)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // States para sa pag-edit ng task
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemTitle, setEditingItemTitle] = useState("");

  const loadItems = async () => {
    try {
      const res = await api.get(`/get-items/${listId}`);
      setItems(res.data.items || []);
      setListTitle(res.data.listInfo?.title || "Board");
    } catch (err) {
      console.error("Error loading items:", err);
    }
  };

  useEffect(() => { loadItems(); }, [listId]);

  const showToast = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      await api.post("/add-item", { listId, title: newItem });
      setNewItem("");
      loadItems();
      showToast("Task added! ✨");
    } catch (err) {
      showToast("Failed to add", "error");
    }
  };

  const saveEditItem = async (itemId) => {
    if (!editingItemTitle.trim()) return setEditingItemId(null);
    try {
      await api.put(`/edit-item/${itemId}`, { title: editingItemTitle });
      setEditingItemId(null);
      loadItems();
      showToast("Task updated! ✅");
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const confirmDeleteItem = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteItem = async () => {
    try {
      await api.delete(`/delete-item/${itemToDelete}`);
      setShowDeleteModal(false);
      loadItems();
      showToast("Task removed 🗑️");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-6 md:p-12 font-sans relative">
      
      {/* FLOATING TOAST NOTIFICATION */}
      {msg.text && (
        <div className={`fixed top-10 z-[110] animate-in slide-in-from-top-5 duration-300 px-8 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 text-white ${msg.type === 'error' ? 'bg-rose-500' : 'bg-indigo-600'}`}>
          {msg.type === 'error' ? '❌' : '✨'} {msg.text}
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
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Task Management</p>
        </div>
      </div>

      {/* ADD TASK INPUT */}
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-white mb-8">
        <form onSubmit={addItem} className="flex gap-3">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-lg font-medium"
            placeholder="What needs to be done?"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
            Add
          </button>
        </form>

        {/* TASKS LIST */}
        <div className="space-y-3 mt-10">
          {items.length === 0 ? (
            <div className="text-center py-10 text-slate-300 italic font-medium">No tasks yet. Start by adding one!</div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="group flex justify-between items-center p-5 bg-white border border-slate-50 rounded-[1.5rem] hover:border-indigo-100 hover:shadow-md transition-all">
                <div className="flex-1">
                  {editingItemId === i.id ? (
                    <input
                      autoFocus
                      value={editingItemTitle}
                      onChange={(e) => setEditingItemTitle(e.target.value)}
                      onBlur={() => saveEditItem(i.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEditItem(i.id)}
                      className="text-lg font-bold text-indigo-600 outline-none w-full bg-indigo-50 px-3 py-1 rounded-xl border-2 border-indigo-200"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-700">{i.title}</span>
                  )}
                </div>

                <div className="flex gap-3 ml-4">
                  <button 
                    onClick={() => { setEditingItemId(i.id); setEditingItemTitle(i.title); }}
                    className="text-indigo-400 hover:text-indigo-600 font-bold text-sm transition-colors px-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => confirmDeleteItem(i.id)}
                    className="text-slate-300 hover:text-rose-500 font-bold text-sm transition-colors px-2"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CUSTOM DELETE MODAL (FOR TASKS) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-4xl">
              🗑️
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Delete Task?</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Are you sure you want to remove this task?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                No
              </button>
              <button 
                onClick={handleDeleteItem} 
                className="flex-1 py-4 rounded-2xl font-bold bg-rose-600 text-white shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListItem;