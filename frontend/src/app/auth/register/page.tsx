// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "buyer" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    try {
      // backend expects JSON body for users.register
      await api.post("/users/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => (window.location.href = "/auth/login"), 1400);
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.detail || "Error registering user");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" placeholder="Full Name" className="border p-2 rounded"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input type="email" placeholder="Email" className="border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input type="password" placeholder="Password" className="border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select className="border p-2 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="agent">Agent</option>
        </select>
        <button className="bg-green-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
