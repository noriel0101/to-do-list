import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
    const [lists, setLists] = useState([]);
    const [newTitle, setNewTitle] = useState(""); // Ginawang simple string na lang
    const navigate = useNavigate();
    const API = "http://localhost:3000";

    const fetchLists = () => {
        axios.get(`${API}/get-list`, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setLists(res.data.list);
                }
            })
            .catch(err => console.error("Error fetching:", err));
    };

    useEffect(() => { fetchLists(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTitle) return;

        try {
            // Title lang ang pinapasa sa backend
            await axios.post(`${API}/add-list`, { title: newTitle }, { withCredentials: true });
            setNewTitle(""); // I-clear ang input
            fetchLists(); // I-refresh ang UI
        } catch (err) {
            console.error("Error adding list:", err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        if(confirm("Delete this list?")) {
            try {
                await axios.delete(`${API}/delete-list/${id}`, { withCredentials: true });
                fetchLists();
            } catch (err) {
                console.error("Error deleting:", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My To-Do Lists</h1>
                
                {/* ADD LIST FORM - Mas malinis na tignan */}
                <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl shadow-sm mb-10 flex gap-3 border border-gray-100">
                    <input 
                        className="flex-1 p-2 outline-none text-lg px-4" 
                        placeholder="Enter list name (e.g. Work Tasks)" 
                        value={newTitle} 
                        onChange={e => setNewTitle(e.target.value)} 
                        required 
                    />
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">
                        + Add List
                    </button>
                </form>

                {/* LIST DISPLAY */}
                <div className="flex flex-col gap-4">
                    {lists.map((list) => (
                        <div 
                            key={list.id} 
                            onClick={() => navigate(`/list/${list.id}`)} 
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex justify-between items-center group"
                        >
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {list.title}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    {list.item_count || 0} items
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => handleDelete(e, list.id)} 
                                    className="text-red-300 hover:text-red-600 transition-colors px-2 opacity-0 group-hover:opacity-100 font-medium"
                                >
                                    Delete
                                </button>
                                <span className="text-gray-300 text-2xl group-hover:text-blue-400 transition-all">
                                    ›
                                </span>
                            </div>
                        </div>
                    ))}

                    {lists.length === 0 && (
                        <div className="text-center py-20 text-gray-400 italic">
                            No lists found. Create your first one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;