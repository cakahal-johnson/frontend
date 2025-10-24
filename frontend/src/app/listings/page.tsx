// frontend/src/app/listings/page.tsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import ListingCard from "@/components/ListingCard";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const skip = (page - 1) * limit;
        const res = await api.get("/listings/", { params: { skip, limit } });
        setListings(res.data.items);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-center">Browse Listings 🏡</h1>

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-center py-10">No listings found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

