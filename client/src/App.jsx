import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const showToast = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering && password !== confirm) return showToast("Passwords do not match!", "error");
    const endpoint = isRegistering ? "/register" : "/login";
    try {
      const res = await api.post(endpoint, { username, password });
      if (res.data.success) {
        if (isRegistering) {
          showToast("Registered! Please login. ✨");
          setIsRegistering(false);
        } else {
          showToast("Welcome to Focus Hub! 🚀");
          setTimeout(() => navigate("/home"), 1000);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error occurred", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center p-6 font-sans relative">
      
      {/* CENTERED TOAST */}
      {msg.text && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-5 duration-300 px-8 py-4 rounded-2xl shadow-2xl font-bold text-white flex items-center gap-3 whitespace-nowrap ${msg.type === 'error' ? 'bg-rose-500' : 'bg-slate-800'}`}>
          {msg.type === 'error' ? '⚠️' : '✨'} {msg.text}
        </div>
      )}

      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg p-10 rounded-[3rem] shadow-xl border border-white/50">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Focus Hub</h1>
          <p className="text-slate-400 font-medium">{isRegistering ? "Create your workspace" : "Welcome back!"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 text-lg" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 text-lg" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {isRegistering && <input type="password" className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 text-lg" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} required />}
          <button className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-lg active:scale-95 transition-all mt-4">{isRegistering ? "Create Account" : "Sign In"}</button>
        </form>
        <p className="text-center mt-8 text-slate-500 font-medium">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-slate-900 font-black hover:underline">{isRegistering ? "Already have an account? Login" : "New here? Join Focus Hub"}</button>
        </p>
      </div>
    </div>
  );
}
export default App;