// src/context/WebSocketContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface WebSocketContextType {
  messages: any[];
  onlineUsers: number[];
  typingUser: number | null;
  connected: boolean;
  sendMessage: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // ✅ Load current user (from localStorage or session)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const { messages, typingUser, onlineUsers, connected, sendMessage } = useWebSocket(
    user?.id || null
  );

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        typingUser,
        onlineUsers,
        connected,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// ✅ Helper hook for easy use
export const useWebSocketContext = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return ctx;
};
