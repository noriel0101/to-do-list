import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Home() {
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const res = await api.get("/get-list");
      if (res.data.success) setLists(res.data.list);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const addList = async (e) => {
    e.preventDefault();
    if (!title) return;
    await api.post("/add-list", { title });
    setTitle("");
    fetchLists();
  };

  const deleteList = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`/delete-list/${id}`);
    fetchLists();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My To-Do Lists</h2>
        <button onClick={() => navigate("/")} className="text-red-500">Logout</button>
      </div>

      <form onSubmit={addList} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New list title"
          className="flex-1 p-2 border rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      {lists.length === 0 ? (
        <p>No lists found.</p>
      ) : (
        lists.map(l => (
          <div key={l.id} className="flex justify-between p-3 border mb-2 rounded cursor-pointer" onClick={() => navigate(`/list/${l.id}`)}>
            <span>{l.title} ({l.item_count || 0})</span>
            <button onClick={(e) => { e.stopPropagation(); deleteList(l.id); }} className="text-red-500">Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
