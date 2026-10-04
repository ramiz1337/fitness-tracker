"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";

export default function HeaderContent() {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 z-10 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 font-semibold uppercase">
        <Link href="/">
          <img className="w-20 object-contain" src="/logo.png" alt="Logo" />
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="text-black hover:text-green-600">Home</Link>

          {!isAuthenticated() && (
            <>
              <Link href="/login" className="text-black hover:text-green-600">Login</Link>
              <Link href="/register" className="text-black hover:text-green-600">Register</Link>
            </>
          )}

          {isAuthenticated() && (
            <>
              <Link href="/calendar" className="text-black hover:text-green-600">Calendar</Link>
              <Link href="/workoutPlan" className="text-black hover:text-green-600">Workout Plans</Link>
              <Link href="/exercises" className="text-black hover:text-green-600">Exercises</Link>
              <button onClick={handleLogout} className="cursor-pointer rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
