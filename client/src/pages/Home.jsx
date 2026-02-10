import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Home() {
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const loadLists = async () => {
    try {
      const res = await api.get("/get-list");
      setLists(res.data.list);
    } catch(err) {
      if(err.response?.status===401) navigate("/");
    }
  };

  useEffect(()=>{loadLists()},[]);

  const addList = async e=>{
    e.preventDefault();
    if(!title) return;
    await api.post("/add-list",{title});
    setTitle("");
    loadLists();
  };

  const deleteList = async id=>{
    if(!window.confirm("Delete this list?")) return;
    await api.delete(`/delete-list/${id}`);
    loadLists();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-8">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My To-Do Lists</h1>
          <button onClick={async()=>{await api.post("/logout");navigate("/");}} className="text-red-500 font-semibold">Logout</button>
        </div>

        <form onSubmit={addList} className="flex gap-2 mb-6">
          <input className="flex-1 px-4 py-2 rounded-xl border outline-none" placeholder="New list name..." value={title} onChange={e=>setTitle(e.target.value)}/>
          <button className="px-5 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600">Add</button>
        </form>

        <div className="space-y-4">
          {lists.map(l=>(
            <div key={l.id} className="flex justify-between items-center p-4 rounded-2xl bg-white shadow cursor-pointer" onClick={()=>navigate(`/list/${l.id}`)}>
              <div>
                <h3 className="font-bold text-lg">{l.title}</h3>
                <p className="text-sm text-gray-500">{l.item_count} items</p>
              </div>
              <button onClick={e=>{e.stopPropagation();deleteList(l.id)}} className="text-red-500 font-semibold">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
