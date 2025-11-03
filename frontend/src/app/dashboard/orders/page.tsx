"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import StatusBadge from "@/components/StatusBadge";
import PaymentBadge from "@/components/PaymentBadge";
import ErrorModal from "@/components/ErrorModal";
import Toast from "@/components/Toast";

interface OrderListingResponse {
  id: number;
  title: string;
  price: number;
  location?: string;
  image_url?: string;
}

interface OrderResponse {
  id: number;
  buyer_id: number;
  listing_id: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  payment_reference?: string;
  amount?: number;
  created_at: string;
  completed_at?: string;
  listing?: OrderListingResponse;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "error" as "error" | "success" | "info",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "info",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/my?page=${page}&page_size=6`);
      setOrders(res.data.orders);
      setHasMore(res.data.hasMore);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setErrorModal({
        open: true,
        title: "Load Failed",
        message: "Unable to fetch your orders. Please try again later.",
        type: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handlePayment = async (order: OrderResponse) => {
    try {
      const res = await api.post(`/orders/${order.id}/pay`, {
        payment_method: "card",
        amount: order.listing?.price || 0,
      });

      // ✅ Show toast success
      setToast({
        show: true,
        message: "Payment successful! 🎉",
        type: "success",
      });

      fetchOrders(); // refresh list
    } catch (error: any) {
      console.error("Payment failed:", error);
      // ⚠️ Show modal error
      setErrorModal({
        open: true,
        title: "Payment Failed",
        message:
          error.response?.data?.detail ||
          "An unexpected error occurred while processing your payment.",
        type: "error",
      });
    }
  };

  const openModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 py-20">
        Loading your orders…
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-700 dark:text-white mb-8">
          My Purchases
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">
            You haven't purchased anything yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-4"
              >
                <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3">
                  <Image
                    src={order.listing?.image_url || "/placeholder-house.jpg"}
                    alt="Listing"
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="font-semibold text-lg mb-1">
                  {order.listing?.title}
                </h3>

                <p className="text-indigo-600 font-semibold mb-2">
                  ${order.listing?.price?.toLocaleString()}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <StatusBadge status={order.status} />
                  {order.payment_status && (
                    <PaymentBadge status={order.payment_status} />
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => openModal(order)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View Details →
                  </button>

                  {order.payment_status !== "paid" ? (
                    <button
                      onClick={() => handlePayment(order)}
                      className="text-sm px-3 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-xs text-green-600 font-semibold">
                      Paid ✅
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Page {page}
          </span>

          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 disabled:opacity-40"
            disabled={!hasMore}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
        handlePayment={handlePayment}
      />

      {/* Error Modal */}
      <ErrorModal
        open={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        title={errorModal.title}
        message={errorModal.message}
        type={errorModal.type}
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
