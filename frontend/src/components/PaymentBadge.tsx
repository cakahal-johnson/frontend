// src/components/PaymentBadge.tsx
export default function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    unpaid: "bg-red-200 text-red-700",
    paid: "bg-green-200 text-green-700",
    refunded: "bg-yellow-200 text-yellow-800",
  };

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${colors[status] || "bg-gray-200 text-gray-600"}`}>
      {status}
    </span>
  );
}
