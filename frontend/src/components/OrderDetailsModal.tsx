// src/components/OrderDetailsModal.tsx
"use client";

import Image from "next/image";
import StatusBadge from "@/components/StatusBadge";
import PaymentBadge from "@/components/PaymentBadge";
import api from "@/lib/axios";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: any;
  handlePayment: (order: any) => void;
}

export default function OrderDetailsModal({
  open,
  onClose,
  order,
  handlePayment,
}: OrderDetailsModalProps) {
  if (!open || !order) return null;

  const listing = order.listing;

  const downloadReceipt = async () => {
    try {
      const res = await api.get(`/orders/${order.id}/receipt`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${order.id}.pdf`;
      a.click();
    } catch (error) {
      console.error("Receipt download failed:", error);
      alert("Failed to download receipt");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative h-52 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src={listing?.image_url || "/placeholder-house.jpg"}
            alt="Listing"
            fill
            className="object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          {listing?.title}
        </h2>

        {/* Price */}
        <p className="text-indigo-600 dark:text-indigo-400 text-xl font-bold mb-3">
          ${listing?.price?.toLocaleString()}
        </p>

        {/* Location */}
        {listing?.location && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            📍 {listing.location}
          </p>
        )}

        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <StatusBadge status={order.status} />
          {order.payment_status && (
            <PaymentBadge status={order.payment_status} />
          )}
        </div>

        {/* Order info */}
        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium">Order ID:</span> #{order.id}
          </p>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          {order.payment_reference && (
            <p>
              <span className="font-medium">Payment Ref:</span>{" "}
              {order.payment_reference}
            </p>
          )}

          {order.completed_at && (
            <p>
              <span className="font-medium">Completed:</span>{" "}
              {new Date(order.completed_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          {order.payment_status !== "paid" ? (
            <button
              onClick={() => handlePayment(order)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow"
            >
              Pay Now
            </button>
          ) : (
            <button
              onClick={downloadReceipt}
              className="px-5 py-2 border border-gray-300 dark:border-gray-700 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Download Receipt PDF
            </button>
          )}

          <button
            onClick={onClose}
            className="text-sm px-4 py-2 text-gray-700 dark:text-gray-300 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
