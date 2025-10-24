// frontend/src/app/listings/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

export default function ListingDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % listing.images.length : null
    );
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + listing.images.length) % listing.images.length
        : null
    );

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading listing...</p>;
  if (!listing) return <p className="text-center py-10">Listing not found.</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* ✅ HERO IMAGE + Favorite Btn */}
      <div className="relative h-96 w-full rounded-xl overflow-hidden shadow">
        <img
          src={listing.main_image}
          alt={listing.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openLightbox(0)}
        />

        <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow hover:scale-105 transition">
          ❤️
        </button>
      </div>

      {/* ✅ Masonry Gallery */}
      {listing.images?.length > 0 && (
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {listing.images.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              className="w-full rounded-lg cursor-pointer hover:opacity-80 transition"
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      )}

      {/* ✅ Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center">
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={closeLightbox}
          >
            ✖
          </button>

          <button
            className="absolute left-5 text-white text-4xl"
            onClick={prevImage}
          >
            ‹
          </button>

          <img
            src={listing.images[lightboxIndex]}
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-lg"
          />

          <button
            className="absolute right-5 text-white text-4xl"
            onClick={nextImage}
          >
            ›
          </button>
        </div>
      )}

      {/* ✅ 2-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left / Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-gray-600">{listing.location}</p>
          <hr />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{listing.description}</p>
          </section>

          <hr />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <Feature label="Bedrooms" value={listing.bedrooms} />
            <Feature label="Bathrooms" value={listing.bathrooms} />
            <Feature label="Size (sqft)" value={listing.size_sqft} />
            <Feature label="Year Built" value={listing.year_built} />
          </div>

          {/* ✅ Scroll Sections */}
          <ScrollSection title="Nearby Schools" />
          <ScrollSection title="Map" />
          <ScrollSection title="Mortgage Calculator" />
          <ScrollSection title="Walk Score" />
          <ScrollSection title="Similar Homes" />
        </div>

        {/* ✅ Sticky Sidebar */}
        <aside className="p-6 space-y-6 bg-white rounded-xl shadow-md h-fit sticky top-20">
          <p className="text-3xl font-bold text-green-700">
            ${listing.price?.toLocaleString()}
          </p>
          <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Contact Agent
          </button>

          {listing.agent && (
            <div className="space-y-2 text-sm mt-4">
              <p className="font-semibold">Agent:</p>
              <p>{listing.agent.name}</p>
              <p className="text-gray-600">{listing.agent.phone}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Feature({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value ?? "-"}</p>
    </div>
  );
}

function ScrollSection({ title }: { title: string }) {
  return (
    <section className="space-y-3 mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        Placeholder coming soon...
      </div>
    </section>
  );
}
