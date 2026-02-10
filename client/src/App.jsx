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
    setMessage("");
    const endpoint = isRegistering ? "/register" : "/login";

    try {
      const payload = isRegistering
        ? { username, password, confirm: confirmPassword }
        : { username, password };
      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        if (isRegistering) setIsRegistering(false);
        else navigate("/home");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isRegistering ? "Register" : "Login"}
        </h1>

        {message && <p className="text-red-600 mb-4 bg-red-100 p-2 rounded">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          {isRegistering && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          )}

          <button className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-pink-600 font-semibold hover:underline"
          >
            {isRegistering ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
