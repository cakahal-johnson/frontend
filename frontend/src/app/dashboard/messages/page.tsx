// app/messages/page.tsx
"use client";
import ChatBox from "@/components/ChatBox";

export default function MessagesPage() {
  return (
    <div className="p-4">
      <ChatBox receiverId={2} title="Chat with Agent Alice" />
    </div>
  );
}
