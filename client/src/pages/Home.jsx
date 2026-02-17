import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Home() {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // States para sa Custom Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/get-list");
      setLists(res.data.list || []);
    } catch { 
      navigate("/"); 
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const add = async (e) => {
    e.preventDefault();
    if (!newList.trim()) return;
    try {
      await api.post("/add-list", { title: newList });
      setNewList("");
      showToast("Board created successfully! ✨");
      load();
    } catch (err) {
      showToast("Failed to create board", "error");
    }
  };

  const save = async (id) => {
    if (!editingTitle.trim()) return setEditingId(null);
    try {
      await api.put(`/edit-list/${id}`, { title: editingTitle });
      setEditingId(null);
      showToast("Board renamed! ✅");
      load();
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const confirmDelete = (id) => {
    setListToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/delete-list/${listToDelete}`);
      setShowDeleteModal(false);
      showToast("Board deleted permanently", "success");
      load();
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

      {/* HEADER SECTION */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Boards</h1>
          <p className="text-slate-500 font-medium">Organize your tasks and focus</p>
        </div>
        <button 
          onClick={async () => { await api.post("/logout"); navigate("/"); }}
          className="px-6 py-2 bg-white text-rose-500 border border-rose-100 rounded-xl font-bold hover:bg-rose-50 shadow-sm transition-all"
        >
          Logout
        </button>
      </div>

      {/* CREATE BOARD INPUT */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-[2.5rem] shadow-xl border border-white mb-8">
        <form onSubmit={add} className="flex flex-col md:flex-row gap-3">
          <input 
            className="flex-1 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-400 bg-slate-50 transition-all text-lg font-medium"
            placeholder="Enter Board Name (e.g. Work, School)"
            value={newList}
            onChange={e => setNewList(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">
            + Add Board
          </button>
        </form>
      </div>

      {/* BOARDS LIST */}
      <div className="w-full max-w-2xl space-y-4">
        {lists.length === 0 ? (
          <div className="text-center py-20 text-slate-300 italic">No boards found. Create your first one above!</div>
        ) : (
          lists.map(l => (
            <div key={l.id} className="group flex justify-between items-center p-6 bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
              <div className="flex-1">
                {editingId === l.id ? (
                  <input 
                    autoFocus
                    className="text-lg font-bold text-indigo-600 outline-none w-full bg-indigo-50 px-3 py-1 rounded-xl border-2 border-indigo-200"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => save(l.id)}
                    onKeyDown={e => e.key === 'Enter' && save(l.id)}
                  />
                ) : (
                  <div className="cursor-pointer" onClick={() => navigate(`/list/${l.id}`)}>
                    <h2 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{l.title}</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{l.item_count || 0} Tasks</p>
                  </div>
                )}
              </div>
              
              {/* ACTION BUTTONS (Laging visible pero mas dark sa hover) */}
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => { setEditingId(l.id); setEditingTitle(l.title); }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
                >
                  EDIT
                </button>
                <button 
                  onClick={() => confirmDelete(l.id)}
                  className="px-4 py-2 bg-rose-50 text-rose-500 rounded-xl font-bold text-xs hover:bg-rose-500 hover:text-white transition-all"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-4xl shadow-inner">
              ⚠️
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Delete Board?</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Are you sure? This will permanently delete this board and all tasks inside it.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 py-4 rounded-2xl font-bold bg-rose-600 text-white shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;