"use client"

import { useState } from "react";
import axios, { AxiosError } from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("faco@gmail.com");
  const [password, setPassword] = useState("StrongPass1!");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");  // Clear previous messages
  
    try {
      const response = await axios.post(
        "http://localhost:5102/users/login",
        
        { email, password }
      );
      console.log("BACKEND'DEN GELEN CEVAP:", response.data);
      setSuccess("Login successful! Redirecting...");

      console.log(response);
      

     localStorage.setItem("user", JSON.stringify({
      id: response.data.user.id,
      name: response.data.user.name, // <-- Bunu ekliyoruz
      email: response.data.user.email,
      token: response.data.token
     }));
  
      signIn({
        auth: {
          token: response.data.token,
          type: "Bearer",
        },
        userState: {
          email,
        },
      });
      setTimeout(() => {
        navigate("/"); // or your protected route
      }, 1500); // 1.5 seconds delay to show success message
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Login error:", err);
    }
  };
  

  return (
    <main className="h-full grow mt-24 flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Welcome</h1>
        <form 
            onSubmit={handleSubmit}    
            className="flex flex-col space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <div>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border-b-2 border-green-500 focus:outline-none focus:ring-green-500 text-black"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="my-4">
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 border-b-2 border-green-500 focus:outline-none focus:ring-green-500 text-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Login
            </button>
            <p className="text-sm mt-1 text-black">
              Don't have an account?{" "}
              <a className="text-green-500 font-semibold" href="/register">
                SignUp
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
