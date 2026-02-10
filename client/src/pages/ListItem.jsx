import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";
import { toast, ToastContainer } from "react-toastify";

function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [listInfo, setListInfo] = useState(null);
  const [newItem, setNewItem] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get(`/get-items/${id}`);
      setItems(res.data.items);
      setListInfo(res.data.listInfo);
    } catch (err) {
      toast.error("Error loading items");
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    try {
      await api.post("/add-item", { listId: id, title: newItem });
      toast.success("Item added!");
      setNewItem("");
      loadData();
    } catch (err) { toast.error(err.response?.data?.message || "Error adding item"); }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/delete-item/${itemId}`);
      toast.success("Item deleted!");
      loadData();
    } catch (err) { toast.error("Error deleting item"); }
  };

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <ToastContainer />
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-6 shadow-lg">
        <button onClick={() => navigate("/home")} className="text-gray-400 mb-4 hover:text-pink-600">← Back to lists</button>

        {listInfo && <>
          <h1 className="text-3xl font-bold mb-1">{listInfo.title}</h1>
          <p className="text-gray-500 mb-4">{listInfo.description}</p>
        </>}

        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add a task..." className="flex-1 px-4 py-2 border rounded-xl outline-none" />
          <button className="px-4 py-2 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl font-semibold">Add</button>
        </form>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl bg-white shadow">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded cursor-pointer" />
                <span>{item.title}</span>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 font-semibold">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListItem;
