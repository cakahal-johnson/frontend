//src/components/ListingCard.tsx
"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

type Props = {
  listing: any;
  favoriteId?: number;
};

export default function ListingCard({ listing, favoriteId }: Props) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(listing.id);

  const [removing, setRemoving] = useState(false);

  const handleFavoriteToggle = async () => {
    setRemoving(true);

    // Remove from server
    try {
      await api.delete(`/favorites/${listing.id}/`);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }

    // Remove from UI immediately
    toggleFavorite(listing);

    setTimeout(() => {
      setRemoving(false);
    }, 300);
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group transition-all duration-300 ${
        removing ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      <img
        src={listing.image_url || "/placeholder.jpg"}
        alt={listing.title}
        className="h-48 w-full object-cover"
      />

      {/* Favorite button */}
      <button
        onClick={handleFavoriteToggle}
        className={`absolute top-3 right-3 p-2 rounded-full transition ${
          fav
            ? "bg-red-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        } hover:scale-105`}
      >
        <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} strokeWidth={2} />
      </button>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {listing.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {listing.category}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          ${listing.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}


