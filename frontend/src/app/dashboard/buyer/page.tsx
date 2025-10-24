"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function BuyerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <ul className="grid gap-4">
          {orders.map((order) => (
            <li key={order.id} className="bg-white p-4 shadow rounded-lg">
              <p>Listing ID: {order.listing_id}</p>
              <p>Status: {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
