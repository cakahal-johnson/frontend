// src/lib/useFavorites.ts
"use client";
import { useState, useEffect } from "react";
import api from "./axios";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/me/favorites");
        setFavorites(res.data.map((l: any) => l.id));
      } catch {}
    };
    load();
  }, []);

  const toggleFavorite = async (listingId: number) => {
    try {
      let updated;
      if (favorites.includes(listingId)) {
        await api.delete(`/favorites/${listingId}`);
        updated = favorites.filter(id => id !== listingId);
      } else {
        await api.post(`/favorites/${listingId}`);
        updated = [...favorites, listingId];
      }
      setFavorites(updated);
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  return { favorites, toggleFavorite };
}
