"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";

export default function Header() {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header className="bg-white w-full fixed top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-2 px-6 font-semibold uppercase">

        <Link href="/">
          <img
            className="w-20 object-contain"
            src="/logo.png"
            alt="Logo"
          />
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="hover:text-green-600 text-black">
            Home
          </Link>

          {!isAuthenticated() && (
            <>
              <Link href="/login" className="hover:text-green-600 text-black">
                Login
              </Link>

              <Link href="/register" className="hover:text-green-600 text-black">
                Register
              </Link>
            </>
          )}

          {isAuthenticated() && (
            <>
              <Link href="/calendar" className="hover:text-green-600 text-black">
                Calendar
              </Link>

              <Link href="/workoutPlan" className="hover:text-green-600 text-black">
                Workout Plans
              </Link>

              <Link href="/exercises" className="hover:text-green-600 text-black">
                Exercises
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}