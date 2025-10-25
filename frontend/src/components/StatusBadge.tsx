// src/components/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-gray-200 text-gray-700",
    completed: "bg-blue-200 text-blue-700",
    delivered: "bg-purple-200 text-purple-700",
    cancelled: "bg-red-200 text-red-700",
  };

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${colors[status] || "bg-gray-200 text-gray-600"}`}>
      {status}
    </span>
  );
}
