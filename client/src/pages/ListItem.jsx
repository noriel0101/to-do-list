import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

function ListItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listInfo, setListInfo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get(`/get-items/${id}`);
      if (res.data.success) {
        setListInfo(res.data.listInfo);
        setTasks(res.data.items);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/");
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    await api.post("/add-item", { listId: id, title: newTask });
    setNewTask("");
    loadData();
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/delete-item/${taskId}`);
    loadData();
  };

  const toggleStatus = async (task) => {
    await api.put(`/edit-item/${task.id}`, { title: task.title, status: task.status === "pending" ? "done" : "pending" });
    loadData();
  };

  if (!listInfo) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate("/home")} className="text-white mb-6 hover:underline">← Back to lists</button>

        <h1 className="text-3xl font-bold text-white">{listInfo.title}</h1>
        <p className="text-gray-100 mb-6">{listInfo.description}</p>

        {/* Add Task */}
        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input
            className="flex-1 p-3 rounded-xl border-none focus:ring-2 focus:ring-white text-gray-700"
            placeholder="New task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="bg-white text-purple-500 px-6 rounded-xl font-semibold hover:bg-purple-100">Add</button>
        </form>

        {/* Tasks */}
        <div className="space-y-3">
          {tasks.length === 0 && <p className="text-white">No tasks yet. Add one above!</p>}
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={() => toggleStatus(task)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className={`text-gray-700 ${task.status === "done" ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="bg-red-200 text-red-600 px-3 py-1 rounded-lg hover:bg-red-300">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListItem;
