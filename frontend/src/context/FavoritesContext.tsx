"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

interface Listing {
  id: number;
  title: string;
  image_url?: string;
  category?: string;
  price?: number;
}

interface FavoritesContextType {
  favorites: Listing[];
  loading: boolean;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (listing: Listing) => Promise<void>;
  isFavorite: (listingId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshFavorites();
  }, []);

  const refreshFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/favorites");
      setFavorites(res.data || []);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (listing: Listing) => {
    try {
      const alreadyFav = favorites.some((f) => f.id === listing.id);
      if (alreadyFav) {
        await api.delete(`/favorites/${listing.id}`);
        setFavorites((prev) => prev.filter((f) => f.id !== listing.id));
        toast.success("Removed from favorites");
      } else {
        await api.post(`/favorites/${listing.id}`);
        setFavorites((prev) => [...prev, listing]);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      toast.error("Error updating favorite");
    }
  };

  const isFavorite = (listingId: number) =>
    favorites.some((f) => f.id === listingId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, refreshFavorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
