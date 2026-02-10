import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Home() {
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const res = await api.get("/get-list");
      if (res.data.success) setLists(res.data.list);
    } catch (err) {
      console.error("Fetch Error:", err.response?.status, err.response?.data);
      if (err.response?.status === 401) navigate("/"); // redirect to login if session expired
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const addList = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    await api.post("/add-list", { title: newTitle });
    setNewTitle("");
    fetchLists();
  };

  const deleteList = async (id) => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    await api.delete(`/delete-list/${id}`);
    fetchLists();
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My To-Do Lists</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-purple-500 px-4 py-2 rounded-lg font-semibold hover:bg-purple-100"
          >
            Logout
          </button>
        </div>

        {/* Add List Form */}
        <form onSubmit={addList} className="flex gap-3 mb-6">
          <input
            className="flex-1 p-3 rounded-xl border-none focus:ring-2 focus:ring-white text-gray-700"
            placeholder="New list title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="bg-white text-purple-500 px-6 rounded-xl font-semibold hover:bg-purple-100">
            + Add
          </button>
        </form>

        {/* Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {lists.length === 0 && <p className="text-white">No lists found. Create one above!</p>}
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white p-5 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <div onClick={() => navigate(`/list/${list.id}`)}>
                <h2 className="text-lg font-bold text-purple-500">{list.title}</h2>
                <p className="text-gray-400 mt-1">{list.item_count || 0} items</p>
              </div>
              <button
                onClick={() => deleteList(list.id)}
                className="mt-3 w-full bg-red-200 text-red-600 py-1 rounded-lg font-medium hover:bg-red-300"
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

export default Home;
