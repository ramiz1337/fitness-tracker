"use client";

import Link from "next/link";
// import { useRouter } from "next/navigation";
// import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
// import useSignOut from "react-auth-kit/hooks/useSignOut";

export default function Header() {
  // const isAuthenticated = useIsAuthenticated();
  // const signOut = useSignOut();
  // const router = useRouter();

  // const handleLogout = () => {
  //   signOut();
  //   router.push("/login");
  // };

  return (
    <header className="bg-white w-full fixed top-0 transition-all ease-in-out z-10">
      <div className="max-w-6xl font-semibold uppercase mx-auto flex items-center justify-between py-1 px-6">

        <Link href="/">
          <img className="w-20 object-contain" src="logo.png" alt="logo" />
        </Link>

        <div className="flex gap-x-8 items-center">
          <Link className="hover:text-green-600 text-black" href="/">Home</Link>
          <a className="hover:text-green-600 text-black" href="/login">Login</a>
          <Link className="hover:text-green-600 text-black" href="/register">Register</Link>
          <Link className="hover:text-green-600 text-black" href="/calender">Calendar</Link>
          <Link className="hover:text-green-600 text-black" href="/workoutPlan">Workout Plans</Link>
          <Link className="hover:text-green-600 text-black" href="/exercises">Exercises</Link>

          {/* {isAuthenticated ? ( */}
            <button
              // onClick={handleLogout}
              className="hover:opacity-60 uppercase bg-red-600 text-white px-2 py-0.5 rounded text-sm cursor-pointer"
            >
              Logout
            </button>
          {/* ) : null} */}
        </div>
      </div>
    </header>
  );
}