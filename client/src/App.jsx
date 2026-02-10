import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "/register" : "/login";
    const payload = isRegistering
      ? { username, password, confirm: confirmPassword }
      : { username, password };

    try {
      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        toast.success(res.data.message, { position: "top-center" });
        if (isRegistering) {
          setIsRegistering(false);
          setUsername("");
          setPassword("");
          setConfirmPassword("");
        } else {
          setTimeout(() => navigate("/home"), 1000);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">{isRegistering ? "Create Account" : "Welcome Back"}</h1>
        <p className="text-center text-gray-500 mb-6">{isRegistering ? "Register to get started" : "Please login to your account"}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {isRegistering && <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />}
          <button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white py-2 rounded-xl font-semibold hover:from-pink-500 hover:to-pink-700"> {isRegistering ? "Register" : "Login"} </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-pink-600 font-medium hover:underline">
            {isRegistering ? "Login here" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
