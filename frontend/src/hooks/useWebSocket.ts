// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

interface MessageEventData {
  event: string;
  data?: any;
  user_id?: number;
  status?: string;
}

export function useWebSocket(userId: number | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [typingUser, setTypingUser] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const wsUrl = `ws://localhost:8000/ws/${userId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🔌 WebSocket connected!");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: MessageEventData = JSON.parse(event.data);

        switch (message.event) {
          case "new_message":
            setMessages((prev) => [message.data, ...prev]);
            console.log("📩 New message received:", message.data);
            break;

          case "typing":
            setTypingUser(message.user_id || null);
            break;

          case "stop_typing":
            setTypingUser(null);
            break;

          case "user_status":
            if (message.status === "online") {
              setOnlineUsers((prev) =>
                prev.includes(message.user_id!) ? prev : [...prev, message.user_id!]
              );
            } else {
              setOnlineUsers((prev) =>
                prev.filter((id) => id !== message.user_id)
              );
            }
            break;

          default:
            console.log("⚙️ Unhandled event:", message);
        }
      } catch (e) {
        console.error("WebSocket message parse error:", e);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected, retrying...");
      setConnected(false);
      setTimeout(() => {
        if (userId) {
          window.location.reload(); // optional: re-init connection
        }
      }, 3000);
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendMessage = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return {
    messages,
    typingUser,
    onlineUsers,
    connected,
    sendMessage,
  };
}
