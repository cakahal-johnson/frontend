// frontend/src/app/listings/page.tsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import ListingCard from "@/components/ListingCard";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const skip = (page - 1) * limit;
        const res = await api.get("/listings/", {
          params: {
            search: search || undefined,
            location: location || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
            skip,
            limit,
          },
        });

        setListings(res.data.items);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [page, search, location, minPrice, maxPrice, sortBy, sortOrder]);

  const totalPages = Math.ceil(total / limit);
  const resetPagination = () => setPage(1);

  return (
    <div className="w-full space-y-10">
      <h1 className="text-3xl font-bold text-center">Browse Listings 🏡</h1>

      {/* ✅ Filters UI */}
      <div className="flex flex-wrap gap-3 justify-center px-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-2"
          value={search}
          onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
        />

        <input
          type="text"
          placeholder="Location"
          className="border rounded px-3 py-2"
          value={location}
          onChange={(e) => { setLocation(e.target.value); resetPagination(); }}
        />

        <input
          type="number"
          placeholder="Min Price"
          className="border w-32 rounded px-3 py-2"
          value={minPrice}
          onChange={(e) => { setMinPrice(e.target.value ? Number(e.target.value) : ""); resetPagination(); }}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border w-32 rounded px-3 py-2"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value ? Number(e.target.value) : ""); resetPagination(); }}
        />

        <select
          className="border rounded px-3 py-2"
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); resetPagination(); }}
        >
          <option value="created_at">Newest</option>
          <option value="price">Price</option>
          <option value="title">A–Z</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); resetPagination(); }}
        >
          <option value="desc">↓ High → Low</option>
          <option value="asc">↑ Low → High</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-center py-10">No listings found.</p>
      ) : (
        <>
          {/* 🏠 Full-width responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full px-4">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">{page} / {totalPages}</span>
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
