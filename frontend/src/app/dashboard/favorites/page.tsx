"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import FavoritesGroup from "./FavoritesGroup";
import Navbar from "@/components/Navbar";
import { FavoriteResponse } from "@/types/favorite";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [groupBy, setGroupBy] = useState<"category" | "agent">("category");

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return setFavorites([]);

      try {
        const res = await api.get("/favorites/");
        setFavorites(res.data);
      } catch (err: any) {
        console.error("Failed to fetch favorites:", err.message);
      }
    };

    fetchFavorites();
  }, []);

  const groupedFavorites = favorites.reduce((acc: Record<string, FavoriteResponse[]>, fav) => {
    const key =
      groupBy === "category"
        ? fav.listing?.category ?? "Uncategorized"
        : fav.listing?.agent?.name ?? "Unknown Agent";

    if (!acc[key]) acc[key] = [];
    acc[key].push(fav);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Favorites Dashboard
          </h1>

          <select
            className="px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-gray-200"
            value={groupBy}
            onChange={(e) =>
              setGroupBy(e.target.value as "category" | "agent")
            }
          >
            <option value="category">Group by Category</option>
            <option value="agent">Group by Agent</option>
          </select>
        </div>

        {Object.keys(groupedFavorites).length > 0 ? (
          Object.entries(groupedFavorites).map(([key, items]) => (
            <FavoritesGroup key={key} title={key} listings={items} />
          ))
        ) : (
          <p className="text-gray-500">No favorites found.</p>
        )}
      </div>
    </div>
  );
}
