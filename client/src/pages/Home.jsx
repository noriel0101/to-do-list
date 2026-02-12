import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Home() {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loadLists = async () => {
    try {
      const res = await api.get("/get-list");
      if (res.data.success) setLists(res.data.list);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
    }
  };

  useEffect(() => { loadLists(); }, []);

  const addList = async (e) => {
    e.preventDefault();
    if (!newList.trim()) return;
    setIsLoading(true);
    try {
      await api.post("/add-list", { title: newList });
      setNewList("");
      loadLists();
      setMessage({ text: "Board Added Successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: "Error adding board", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return setEditingId(null);
    try {
      // Naka-sync sa app.put("/edit-list/:id") ng server.js mo
      await api.put(`/edit-list/${id}`, { title: editingTitle });
      setEditingId(null);
      loadLists();
      setMessage({ text: "Board Renamed!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch {
      setMessage({ text: "Failed to update", type: "error" });
    }
  };

  const deleteList = async (id) => {
    if (!window.confirm("Delete this board?")) return;
    try {
      await api.delete(`/delete-list/${id}`);
      loadLists();
      setMessage({ text: "Board Deleted!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch {
      setMessage({ text: "Delete failed", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12 font-sans text-slate-900">
      
      {/* SUCCESS ALERT */}
      {message.text && (
        <div className="fixed top-10 z-[100] animate-bounce px-8 py-4 rounded-3xl shadow-2xl bg-emerald-500 text-white font-bold flex items-center gap-3">
          <span>✓</span> {message.text}
        </div>
      )}

      {/* HEADER */}
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-5xl font-black text-indigo-600 tracking-tight">Focus Hub</h1>
        <p className="text-slate-400 font-medium mt-2">Simplify your workflow today.</p>
      </div>

      {/* INPUT SECTION */}
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-white">
        <form onSubmit={addList} className="flex gap-3 mb-12">
          <input
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            placeholder="New Board Name..."
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
            {isLoading ? "..." : "Add"}
          </button>
        </form>

        {/* LIST SECTION */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2 mb-4">Boards</h2>
          {lists.map((l) => (
            <div key={l.id} className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="flex-1">
                {editingId === l.id ? (
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveEdit(l.id)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(l.id)}
                    className="text-xl font-bold text-indigo-600 outline-none w-full bg-indigo-50 px-2 rounded-lg"
                  />
                ) : (
                  <span onClick={() => navigate(`/list/${l.id}`)} className="text-xl font-extrabold text-slate-700 cursor-pointer hover:text-indigo-600">
                    {l.title}
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setEditingId(l.id); setEditingTitle(l.title); }} className="text-slate-300 hover:text-indigo-600 font-bold">Edit</button>
                <button onClick={() => deleteList(l.id)} className="text-slate-300 hover:text-rose-500 font-bold">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;