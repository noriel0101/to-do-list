import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function App() {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [isRegistering,setIsRegistering]=useState(false);
  const navigate = useNavigate();

  const handleSubmit=async e=>{
    e.preventDefault();
    const endpoint = isRegistering?"/register":"/login";
    const payload = isRegistering?{username,password,confirm:confirmPassword}:{username,password};
    try{
      const res = await api.post(endpoint,payload);
      if(res.data.success){
        alert(res.data.message);
        if(isRegistering){
          setIsRegistering(false); setUsername(""); setPassword(""); setConfirmPassword("");
        } else { navigate("/home"); }
      }
    } catch(err){
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">{isRegistering?"Create Account":"Login"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={username} onChange={e=>setUsername(e.target.value)} required placeholder="Username" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"/>
          <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"/>
          {isRegistering && <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required type="password" placeholder="Confirm Password" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"/>}
          <button type="submit" className="w-full bg-purple-500 text-white p-3 rounded-xl font-semibold hover:bg-purple-600">{isRegistering?"Register":"Login"}</button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          {isRegistering?"Already have an account?":"No account yet?"} <button onClick={()=>setIsRegistering(!isRegistering)} className="text-purple-500 font-medium">{isRegistering?"Login":"Sign up"}</button>
        </p>
      </div>
    </div>
  );
}

export default App;
