import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { toast, ToastContainer } from "react-toastify";

function Home() {
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();

  const loadLists = async () => {
    try {
      const res = await api.get("/get-list");
      setLists(res.data.list);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
    }
  };

  useEffect(() => { loadLists(); }, []);

  const addList = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.post("/add-list", { title });
      toast.success("List added!");
      setTitle("");
      loadLists();
    } catch (err) { toast.error(err.response?.data?.message || "Error adding list"); }
  };

  const startEdit = (list) => { setEditing(list.id); setEditTitle(list.title); };
  const saveEdit = async (id) => { await api.put(`/edit-list/${id}`, { title: editTitle, description: "" }); setEditing(null); toast.success("List updated!"); loadLists(); };
  const deleteList = async (id) => { if (!window.confirm("Delete this list?")) return; await api.delete(`/delete-list/${id}`); toast.success("List deleted!"); loadLists(); };

  return (
    <div className="min-h-screen bg-pink-100 p-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My To-Do Lists</h1>
          <button onClick={async () => { await api.post("/logout"); navigate("/"); }} className="text-red-500 font-semibold">Logout</button>
        </div>

        <form onSubmit={addList} className="flex gap-2 mb-6">
          <input className="flex-1 px-4 py-2 rounded-xl border outline-none" placeholder="New list name..." value={title} onChange={e => setTitle(e.target.value)} />
          <button className="px-5 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-400 to-pink-600">Add</button>
        </form>

        <div className="space-y-4">
          {lists.length === 0 && <p className="text-center text-gray-500">No lists yet.</p>}

          {lists.map(l => (
            <div key={l.id} className="flex justify-between items-center p-4 rounded-2xl bg-white shadow cursor-pointer" onClick={() => navigate(`/list/${l.id}`)}>
              {editing === l.id ? <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="border px-2 py-1 rounded w-full" /> : <>
                <div>
                  <h3 className="font-bold text-lg">{l.title}</h3>
                  <p className="text-sm text-gray-500">{l.item_count} items</p>
                </div>
              </>}
              <div className="flex gap-2 ml-4">
                {editing === l.id ? <button onClick={() => saveEdit(l.id)} className="text-green-600 font-semibold">Save</button> : <button onClick={() => startEdit(l)} className="text-pink-600 font-semibold">Edit</button>}
                <button onClick={() => deleteList(l.id)} className="text-red-500 font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
