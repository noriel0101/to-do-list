import { useParams,useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import api from "./api";

export default function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items,setItems] = useState([]);
  const [listInfo,setListInfo] = useState(null);
  const [newItem,setNewItem] = useState("");

  const loadData=async()=>{
    const res = await api.get(`/get-items/${id}`);
    setItems(res.data.items);
    setListInfo(res.data.listInfo);
  };

  useEffect(()=>{loadData()},[id]);

  const addItem=async e=>{
    e.preventDefault();
    if(!newItem) return;
    await api.post("/add-item",{listId:id,title:newItem});
    setNewItem("");
    loadData();
  };

  const deleteItem=async itemId=>{
    await api.delete(`/delete-item/${itemId}`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl">
        <button onClick={()=>navigate("/home")} className="text-gray-600 hover:text-purple-600 mb-4">← Back</button>
        {listInfo && <h1 className="text-3xl font-bold mb-4">{listInfo.title}</h1>}

        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input className="flex-1 px-4 py-2 rounded-xl border outline-none" placeholder="New task..." value={newItem} onChange={e=>setNewItem(e.target.value)}/>
          <button className="px-5 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600">Add</button>
        </form>

        <div className="space-y-3">
          {items.map(item=>(
            <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-white shadow">
              <span>{item.title}</span>
              <button onClick={()=>deleteItem(item.id)} className="text-red-500 font-semibold">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
