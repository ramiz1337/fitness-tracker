import Link from "next/link";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";

export default function Header() {
//   const isAuthenticated = useIsAuthenticated();
//   const signOut = useSignOut();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     signOut();
//     navigate("/login");
//   };

  return (
    <header className="bg-white w-full fixed top-0 transition-all ease-in-out z-10">
      <div className="max-w-6xl font-semibold uppercase mx-auto flex items-center justify-between py-1 px-6">
        <Link href="/">
          <img className="w-20 object-contain" src="logo.png" alt="logo" />
        </Link>
        <div className="flex gap-x-8 items-center">
            <Link className="hover:text-green-600 text-black" href="/">Home</Link>
            <Link className="hover:text-green-600 text-black" href="/login">Login</Link>
            <Link className="hover:text-green-600 text-black" href="/register">Register</Link>
            <Link className="hover:text-green-600 text-black" href="/calender">Calender</Link>
            <Link className="hover:text-green-600 text-black" href="/workoutPlan">Workout Plans</Link>
            <Link className="hover:text-green-600 text-black" href="/exercises">Exercises</Link>
            <button
              className="hover:opacity-60 uppercase bg-red-600 text-white px-2 py-0.5 rounded text-sm cursor-pointer"
            >
              Logout
            </button>
        </div>
      </div>
    </header>
  );
}
