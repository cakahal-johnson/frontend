"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { Bell } from "lucide-react";
import api from "@/lib/axios";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  if (!user?.id) return;
  const token = localStorage.getItem("token");
  const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${user.id}?token=${token}`);

  ws.onopen = () => console.log("🔌 WebSocket connected");
  ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.event) {
        case "new_message":
          setMessages((prev) => [msg.data, ...prev]);
          break;
        case "user_status":
          console.log(`👤 User ${msg.user_id} is ${msg.status}`);
          break;
        case "typing":
          console.log(`💬 User ${msg.user_id} is typing...`);
          break;
        case "stop_typing":
          console.log(`✋ User ${msg.user_id} stopped typing`);
          break;
        default:
          console.log("📩 Unhandled WS event:", msg);
      }
    };
      ws.onclose = () => console.log("❌ WebSocket closed");
      return () => ws.close();
    }, [user]);


  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/messages/inbox");
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg px-6 py-4 flex justify-between items-center rounded-b-2xl">
      <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl hover:opacity-90 transition">
        <span className="text-3xl">🏠</span>
        <span className="tracking-tight">RealEstate<span className="text-yellow-300">Hub</span></span>
      </Link>

      <div className="flex items-center gap-5 text-white font-medium relative">
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 hover:bg-white/10 rounded-full"
            >
              <Bell size={22} />
              {messages.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b font-semibold text-sm bg-gray-50">Inbox</div>
                <div className="max-h-60 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-500 p-3">No new messages.</p>
                  ) : (
                    messages.slice(0, 5).map((msg) => (
                      <div
                        key={msg.id}
                        className="px-4 py-2 border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm font-medium">{msg.content}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href="/dashboard/messages"
                  className="block text-center text-blue-600 text-sm p-2 hover:bg-gray-100 font-semibold"
                >
                  View All Messages
                </Link>
              </div>
            )}
          </div>
        )}

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
            <Link href="/auth/login" className="hover:text-yellow-300 transition">Login</Link>
            <Link href="/auth/register" className="bg-yellow-300 text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-indigo-800 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
