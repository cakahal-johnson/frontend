// src/components/Chat/ChatInbox.tsx
"use client";
import React, { useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function ChatInbox({ userId }: { userId: number }) {
  const { messages, typingUser, onlineUsers, connected, sendMessage } = useWebSocket(userId);

  useEffect(() => {
    if (typingUser) {
      console.log(`💬 User ${typingUser} is typing...`);
    }
  }, [typingUser]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Inbox</h2>

      <p>Connection: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <div className="border p-2 rounded-md mt-2 max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet...</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="p-2 border-b">
              <strong>From:</strong> {m.sender_id} <br />
              {m.content}
            </div>
          ))
        )}
      </div>

      {typingUser && <p className="text-sm italic text-gray-500">User {typingUser} is typing...</p>}
    </div>
  );
}
