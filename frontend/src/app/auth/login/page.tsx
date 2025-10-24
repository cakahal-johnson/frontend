// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { setTokens } from "@/lib/auth";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", form.email); // OAuth2PasswordRequestForm expects username/password
      formData.append("password", form.password);

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Expect backend to return { access_token, refresh_token }
      const access = res.data.access_token;
      const refresh = res.data.refresh_token;

      if (!access) {
        setError("Login failed: no token returned");
        return;
      }

      // Save both tokens
      setTokens(access, refresh);

      // redirect to dashboard (or home)
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
