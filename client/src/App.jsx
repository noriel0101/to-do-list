import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

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
        alert(res.data.message || "Success!");
        if (isRegistering) {
          setIsRegistering(false);
          setUsername("");
          setPassword("");
          setConfirmPassword("");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">{isRegistering ? "Create Account" : "Welcome Back"}</h1>
        <p className="text-center text-gray-500 mb-6">{isRegistering ? "Register to get started" : "Please login to your account"}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 outline-none" required/>
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 outline-none" required/>
          {isRegistering && <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 outline-none" required/>}
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl font-semibold">{isRegistering ? "Register" : "Login"}</button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button onClick={()=>setIsRegistering(!isRegistering)} className="text-blue-600 hover:underline">{isRegistering ? "Login here" : "Sign up"}</button>
        </p>
      </div>
    </div>
  );
}

export default App;
