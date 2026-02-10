import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [listInfo, setListInfo] = useState(null);
  const [newItem, setNewItem] = useState("");

  const loadData = async () => {
    const res = await api.get(`/get-items/${id}`);
    if (res.data.success) {
      setItems(res.data.items);
      setListInfo(res.data.listInfo);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    await api.post("/add-item", { listId: id, title: newItem });
    setNewItem("");
    loadData();
  };

  const deleteItem = async (itemId) => {
    await api.delete(`/delete-item/${itemId}`);
    loadData();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/home")} className="mb-4 text-blue-600">← Back</button>
      {listInfo && <h1 className="text-2xl font-bold mb-2">{listInfo.title}</h1>}
      <form onSubmit={addItem} className="flex gap-2 mb-4">
        <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="New task" className="flex-1 p-2 border rounded" />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>
      {items.map(item => (
        <div key={item.id} className="flex justify-between p-2 border mb-2 rounded">
          <span>{item.title}</span>
          <button onClick={() => deleteItem(item.id)} className="text-red-500">Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ListItem;
