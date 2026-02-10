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
        alert(response.data.message);

        if (isRegistering) {
          // After registering, automatically switch to login
          setIsRegistering(false);
          setConfirmPassword("");
          setPassword("");
          setUsername("");
        } else {
          // After login, go to dashboard
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const message = error.response?.data?.message || "Something went wrong";
      alert("Error: " + message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isRegistering
            ? "Register to get started"
            : "Please login to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm password"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            {isRegistering ? "Register Now" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isRegistering ? "Login here" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
