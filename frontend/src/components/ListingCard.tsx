"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";


export default function ListingCard({ listing }: { listing: any }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(listing.id);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
      <img
        src={listing.image_url || "/placeholder.jpg"}
        alt={listing.title}
        className="h-48 w-full object-cover"
      />

      {/* Favorite button */}
      <button
        onClick={() => toggleFavorite(listing)}
        className={`absolute top-3 right-3 p-2 rounded-full transition ${
          fav
            ? "bg-red-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        } hover:scale-105`}
      >
        <Heart
          className={`w-5 h-5 ${fav ? "fill-current" : ""}`}
          strokeWidth={2}
        />
      </button>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {listing.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {listing.category}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          ${listing.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

