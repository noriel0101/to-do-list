import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "/register" : "/login";
      const payload = isRegistering ? { username, password, confirm: confirmPassword } : { username, password };
      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        if (isRegistering) {
          setIsRegistering(false);
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setMessage("Registered successfully! Please login.");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setMessage("Error: Invalid credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">{isRegistering ? "Register" : "Login"}</h1>
        {message && <p className="text-center text-pink-600 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-2 border rounded-xl outline-none" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border rounded-xl outline-none" />
          {isRegistering && <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-xl outline-none" />}
          <button type="submit" className="w-full bg-pink-400 text-white py-2 rounded-xl font-bold hover:bg-pink-500 transition">{isRegistering ? "Register" : "Login"}</button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button className="text-pink-500 font-semibold" onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? "Login" : "Sign Up"}</button>
        </p>
      </div>
    </div>
  );
}

export default App;
