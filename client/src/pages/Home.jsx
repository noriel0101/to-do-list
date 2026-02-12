import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Home() {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/get-list");
      setLists(res.data.list || []);
    } catch { navigate("/"); }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if(!newList) return;
    await api.post("/add-list", { title: newList });
    setNewList("");
    setMsg("Added!");
    load();
    setTimeout(() => setMsg(""), 2000);
  };

  const save = async (id) => {
    await api.put(`/edit-list/${id}`, { title: editingTitle });
    setEditingId(null);
    setMsg("Updated!");
    load();
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      {msg && <div className="fixed top-5 bg-blue-600 text-white px-6 py-2 rounded-full font-bold">{msg}</div>}

      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-blue-600 mb-6">FOCUS HUB</h1>
        
        <form onSubmit={add} className="mb-6 flex flex-col gap-2">
          <input 
            className="border p-4 rounded-xl outline-none focus:border-blue-500 bg-gray-50"
            placeholder="New Board Name"
            value={newList}
            onChange={e => setNewList(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-4 rounded-xl font-bold">ADD BOARD</button>
        </form>

        <div className="space-y-3">
          {lists.map(l => (
            <div key={l.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
              {editingId === l.id ? (
                <input 
                  autoFocus
                  className="border px-2 py-1 rounded w-full"
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                  onBlur={() => save(l.id)}
                  onKeyDown={e => e.key === 'Enter' && save(l.id)}
                />
              ) : (
                <span onClick={() => navigate(`/list/${l.id}`)} className="font-bold cursor-pointer hover:text-blue-600">{l.title}</span>
              )}
              
              <button 
                onClick={() => { setEditingId(l.id); setEditingTitle(l.title); }}
                className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold"
              >
                EDIT
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;