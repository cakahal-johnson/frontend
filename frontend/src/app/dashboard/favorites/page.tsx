// src/app/dashboard/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import FavoritesGroup from "./FavoritesGroup";
import { FavoriteResponse } from "@/types/favorite";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [groupBy, setGroupBy] = useState<"category" | "agent">("category");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/favorites/");
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const groupedFavorites = favorites.reduce(
    (acc: Record<string, FavoriteResponse[]>, fav) => {
      const key =
        groupBy === "category"
          ? fav.listing?.category ?? "Uncategorized"
          : fav.listing?.agent?.name ?? "Unknown Agent";

      if (!acc[key]) acc[key] = [];
      acc[key].push(fav);
      return acc;
    },
    {}
  );

  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-300 py-20">
        Loading favorites…
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-white">
            Your Favorites
          </h1>

          <select
            className="w-full sm:w-auto px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm"
            value={groupBy}
            onChange={(e) =>
              setGroupBy(e.target.value as "category" | "agent")
            }
          >
            <option value="category">Group by Category</option>
            <option value="agent">Group by Agent</option>
          </select>
        </div>

        {/* Listings */}
        <div className="space-y-6 animate-fadeIn">
          {Object.keys(groupedFavorites).length > 0 ? (
            Object.entries(groupedFavorites).map(([key, items]) => (
              <FavoritesGroup key={key} title={key} listings={items} />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-10">
              No favorites found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
