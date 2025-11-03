"use client";

import { useEffect } from "react";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "error" | "success" | "info";
}

export default function ErrorModal({
  open,
  onClose,
  title = "Error",
  message = "Something went wrong.",
  type = "error",
}: ErrorModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (!open) return null;

  const colors = {
    error: "bg-red-100 border-red-500 text-red-700",
    success: "bg-green-100 border-green-500 text-green-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
  };

  const icons = {
    error: "❌",
    success: "✅",
    info: "ℹ️",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md p-6 rounded-xl border shadow-lg ${colors[type]} bg-white dark:bg-gray-900`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icons[type]}</span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm leading-relaxed">{message}</p>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
