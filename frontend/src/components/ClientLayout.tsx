"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      {children}
      <Toaster position="top-right" />
    </FavoritesProvider>
  );
}
