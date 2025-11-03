// app/components/ChatBox.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";

interface ChatBoxProps {
  receiverId: number;  // The other person’s user ID
  title?: string;      // Optional title (e.g., Agent or Buyer name)
}

export default function ChatBox({ receiverId, title }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [typingUser, setTypingUser] = useState<number | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // ✅ Typing logic
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<any>(null);

  const handleTyping = () => {
    if (!wsRef.current) return;
    if (!isTyping) {
      wsRef.current.send(
        JSON.stringify({
          event: "typing",
          receiver_id: receiverId,
        })
      );
      setIsTyping(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      wsRef.current!.send(
        JSON.stringify({
          event: "stop_typing",
          receiver_id: receiverId,
        })
      );
      setIsTyping(false);
    }, 1500);
  };

  // ✅ Setup WebSocket (real-time updates, online users, typing, seen)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    if (!userData?.id) return;

    const token = localStorage.getItem("token");
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userData.id}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("🔌 WebSocket connected");
    ws.onclose = () => console.log("❌ WebSocket disconnected");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.event) {
        case "new_message":
          setMessages((prev) => [msg.data, ...prev]);
          ws.send(JSON.stringify({
            event: "delivered",
            message_id: msg.data.id,
            sender_id: msg.data.sender_id
          }));
          break;
        case "typing":
          setTypingUser(msg.user_id);
          break;
        case "stop_typing":
          setTypingUser(null);
          break;
        case "online_users":
          setOnlineUsers(msg.user_ids);
          break;
        case "message_seen":
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msg.message_id ? { ...m, seen: true } : m
            )
          );
          break;
        default:
          console.log("Unhandled event:", msg);
      }
    };

    return () => ws.close();
  }, [receiverId]);

  // ✅ Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/messages/inbox");
        const filtered = res.data.filter(
          (m: any) =>
            m.receiver_id === receiverId || m.sender_id === receiverId
        );
        setMessages(filtered);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    fetchMessages();
  }, [receiverId]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await api.post("/messages", {
        receiver_id: receiverId,
        content: newMessage,
      });

      setMessages((prev) => [res.data, ...prev]);
      setNewMessage("");

      // Notify server message was sent
      wsRef.current?.send(
        JSON.stringify({
          event: "delivered",
          message_id: res.data.id,
          receiver_id: receiverId,
        })
      );
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // ✅ Helper to check online status
  const isReceiverOnline = onlineUsers.includes(receiverId);

  // ✅ Mark messages as seen when viewing
  useEffect(() => {
    const unseen = messages.filter(
      (m) => m.receiver_id === user?.id && !m.seen
    );
    if (unseen.length > 0 && wsRef.current) {
      unseen.forEach((msg) => {
        wsRef.current!.send(
          JSON.stringify({
            event: "seen",
            message_id: msg.id,
            sender_id: msg.sender_id,
          })
        );
      });
    }
  }, [messages]);

  return (
    <div className="p-6 bg-white rounded-lg shadow flex flex-col h-[80vh]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title || "Chat"}</h2>
        <span
          className={`text-sm font-medium ${
            isReceiverOnline ? "text-green-600" : "text-gray-400"
          }`}
        >
          {isReceiverOnline ? "● Online" : "● Offline"}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto border p-3 rounded-md mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 my-2 rounded-lg max-w-xs ${
                msg.sender_id === user?.id
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-100"
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </p>
              {msg.sender_id === user?.id && (
                <p
                  className={`text-xs mt-1 ${
                    msg.seen
                      ? "text-blue-500"
                      : msg.delivered
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {msg.seen
                    ? "Seen ✓✓"
                    : msg.delivered
                    ? "Delivered ✓"
                    : "Sent"}
                </p>
              )}
            </div>
          ))
        )}
        {typingUser && (
          <p className="text-sm text-gray-400 italic mt-2">
            User {typingUser} is typing...
          </p>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
