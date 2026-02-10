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
      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        if (isRegistering) {
          alert(response.data.message);
          setIsRegistering(false);
          setUsername("");
          setPassword("");
          setConfirmPassword("");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const message = err.response?.data?.message || "Something went wrong";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isRegistering ? "Register to start your tasks" : "Login to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="mt-1 w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1 w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="mt-1 w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 transition"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-purple-600 font-medium hover:underline"
          >
            {isRegistering ? "Login here" : "Sign up"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default App;
