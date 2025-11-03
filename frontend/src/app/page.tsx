// app/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";

interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  image_url?: string;
  description?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchListings = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get("/listings", {
        params: {
          skip: reset ? 0 : page * 10,
          limit: 10,
          search: search || undefined,
          location: location || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        },
      });

      const data = res.data.items || res.data;
      if (reset) {
        setListings(data);
      } else {
        setListings((prev) => [...prev, ...data]);
      }

      if (data.length === 0) setHasMore(false);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, location, minPrice, maxPrice, loading]);

  useEffect(() => {
    fetchListings(true);
  }, []);

  const handleSearch = () => {
    setPage(0);
    setHasMore(true);
    fetchListings(true);
  };

  const lastListingRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 0) fetchListings();
  }, [page]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          Find Your Dream Home with{" "}
          <span className="text-yellow-300">RealEstateHub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8"
        >
          Browse listings, compare properties, and connect with trusted agents — all in one place.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            Explore Listings
          </button>
        </motion.div>
      </section>

      {/* 🧭 Search + Filter Bar */}
      <section className="bg-white shadow-sm py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-3 items-center justify-center">
          <input
            type="text"
            placeholder="Search title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-md w-full md:w-1/4"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded-md w-full md:w-1/5"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded-md w-24 md:w-32"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded-md w-24 md:w-32"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Apply Filters
          </button>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Featured Properties
          </h2>

          {listings.length === 0 && !loading ? (
            <div className="text-center text-gray-500">
              <p className="mb-8">No properties found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {listings.map((listing, index) => {
                const isLast = index === listings.length - 1;
                return (
                  <motion.div
                    key={listing.id}
                    ref={isLast ? lastListingRef : null}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/orders?listing=${listing.id}`)}
                  >
                    <Image
                      src={listing.image_url || "/window.svg"}
                      alt={listing.title}
                      width={400}
                      height={260}
                      className="object-cover w-full h-56"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
                      <p className="text-blue-600 font-bold">${listing.price.toLocaleString()}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {loading && <p className="text-center text-gray-400 mt-6">Loading...</p>}
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} RealEstateHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
