"use client"

import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5102/users/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful. You can now log in.");
      console.log("Response:", response);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Registration failed.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <main className="h-full mt-24 grow flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Register</h1>
        <form 
        onSubmit={handleSubmit} 
        className="flex flex-col space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <div className="mb-4">
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-4 py-2 border-b-2 border-green-500 focus:outline-none focus:ring-green-500 text-black"
            placeholder="User name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          </div>
          <div>
            <input
              type="email"
              id="email"
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
              id="password"
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
              Create An Account
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
