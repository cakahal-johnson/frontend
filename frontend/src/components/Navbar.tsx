"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg px-6 py-4 flex justify-between items-center rounded-b-2xl">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl hover:opacity-90 transition">
        <span className="text-3xl">🏠</span>
        <span className="tracking-tight">RealEstate<span className="text-yellow-300">Hub</span></span>
      </Link>

      {/* Links / User Controls */}
      <div className="flex items-center gap-5 text-white font-medium">
        {user ? (
          <>
            <span className="hidden sm:block bg-white/10 px-3 py-1 rounded-full text-sm text-yellow-200">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="bg-white text-indigo-700 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 hover:text-indigo-900 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="hover:text-yellow-300 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-yellow-300 text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-indigo-800 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
