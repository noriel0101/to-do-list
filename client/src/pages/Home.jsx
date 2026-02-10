import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Home() {
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const loadLists = async () => {
    try {
      const res = await api.get("/get-list");
      setLists(res.data.list);
    } catch {
      navigate("/");
    }
  };

  useEffect(() => { loadLists(); }, []);

  const addList = async (e) => {
    e.preventDefault();
    if (!title) return;
    await api.post("/add-list", { title });
    setTitle("");
    loadLists();
  };

  const deleteList = async (id) => {
    await api.delete(`/delete-list/${id}`);
    loadLists();
  };

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My To-Do Lists</h1>
          <button className="text-red-500 font-semibold" onClick={async () => {await api.post("/logout"); navigate("/");}}>Logout</button>
        </div>

        <form onSubmit={addList} className="flex gap-2 mb-6">
          <input placeholder="New list..." value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 px-4 py-2 border rounded-xl outline-none"/>
          <button className="bg-pink-400 text-white px-5 py-2 rounded-xl font-bold hover:bg-pink-500 transition">Add</button>
        </form>

        <div className="space-y-3">
          {lists.map(l => (
            <div key={l.id} className="flex justify-between items-center p-4 rounded-2xl shadow bg-white cursor-pointer" onClick={() => navigate(`/list/${l.id}`)}>
              <span>{l.title} ({l.item_count})</span>
              <button onClick={(e)=>{e.stopPropagation(); deleteList(l.id);}} className="text-red-500 font-semibold hover:text-red-600">Delete</button>
            </div>
          ))}
          {lists.length === 0 && <p className="text-gray-400 text-center">No lists yet. Add one above!</p>}
        </div>
      </div>
    </div>
  );
}

export default Home;
