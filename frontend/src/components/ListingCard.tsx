// src/components/ListingCard.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";

type Props = {
  listing: any;
  favoriteId?: number;
};

export default function ListingCard({ listing, favoriteId }: Props) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [loadingOrder, setLoadingOrder] = useState(false);

  const orderListing = async () => {
  setLoadingOrder(true);
  try {
    const res = await api.post(`/orders/`, {
      listing_id: listing.id,
      amount: listing.price,
      payment_method: "card",
    });

      router.push("/dashboard/orders");
    } catch (error: any) {
      console.error("Order failed:", error);
      alert(error?.response?.data?.detail || "Failed to create order.");
    }
    setLoadingOrder(false);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-3 relative">
      
      {/* 💛 Favorite Button */}
      <button
        className="absolute top-3 right-3 p-2 bg-white/70 rounded-full shadow hover:scale-110 transition"
        onClick={() => toggleFavorite(listing)}
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite(listing.id) ? "text-red-500 fill-red-500" : "text-gray-500"
          }`}
        />
      </button>

      {/* Image */}
      <img
        src={listing.image_url || "/placeholder-house.jpg"}
        alt={listing.title}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />

      <h2 className="font-semibold text-lg line-clamp-1">{listing.title}</h2>
      <p className="text-indigo-600 font-semibold mb-2">
        ${listing.price?.toLocaleString()}
      </p>

      {/* ✅ CTA Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="text-sm font-medium text-gray-700 hover:underline"
          onClick={() => router.push(`/listings/${listing.id}`)}
        >
          View →
        </button>

        <button
          onClick={orderListing}
          disabled={loadingOrder}
          className="text-sm px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
        >
          {loadingOrder ? "Ordering…" : "Order"}
        </button>
      </div>
    </div>
  );
}
