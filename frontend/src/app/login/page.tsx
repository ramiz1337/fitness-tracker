"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSignIn } from "react-auth-kit";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("fac2o@gmail.com");
  const [password, setPassword] = useState("faco123123.");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const signIn = useSignIn();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      // 1) Login request
      const loginResponse = await axios.post(
        "http://localhost:5102/users/login",
        {
          email,
          password,
        }
      );


      console.log("LOGIN RESPONSE:", loginResponse.data);


      // Backend accessToken döndürüyor
      const token = loginResponse.data.accessToken;


      if (!token) {
        throw new Error("Token not found");
      }


      // 2) Mevcut kullanıcıyı al
      const userResponse = await axios.get(
        "http://localhost:5102/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log("CURRENT USER:", userResponse.data);


      const user = userResponse.data;


      // 3) React Auth Kit'e login yap
      signIn({
        token: token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });


      // 4) Kullanıcı bilgisini sakla
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          token: token,
        })
      );


      setSuccess("Login successful! Redirecting...");


      // 5) Ana sayfaya git
      setTimeout(() => {
        router.push("/");
      }, 1500);


    } catch (err) {

      if (err instanceof AxiosError) {

        console.log(
          "AXIOS ERROR:",
          err.response?.data
        );

        setError(
          err.response?.data?.message ||
          "Login failed."
        );

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


        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Welcome
        </h1>


        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4"
        >


          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}


          {success && (
            <p className="text-green-500 text-sm">
              {success}
            </p>
          )}



          <div>

            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border-b-2 border-green-500 focus:outline-none focus:ring-green-500 text-black"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>




          <div className="my-4">

            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 border-b-2 border-green-500 focus:outline-none focus:ring-green-500 text-black"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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

              <a
                className="text-green-500 font-semibold"
                href="/register"
              >
                SignUp
              </a>

            </p>


          </div>


        </form>


      </div>


    </main>
  );
}