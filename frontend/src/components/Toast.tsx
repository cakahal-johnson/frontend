"use client";

import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "info";
  onClose: () => void;
}

export default function Toast({ show, message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  const colors =
    type === "success"
      ? "bg-green-500 text-white"
      : "bg-blue-500 text-white";

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg transition-all transform ${
        show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${colors}`}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
