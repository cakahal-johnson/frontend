// frontend/src/app/listings/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ScrollNav from "@/components/ScrollNav";

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => {
    if (listing?.images?.length) setLightboxIndex(i);
  };
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (!listing?.images?.length) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % listing.images.length : null
    );
  };
  const prevImage = () => {
    if (!listing?.images?.length) return;
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + listing.images.length) % listing.images.length
        : null
    );
  };

  // ✅ Fetch Listing
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
    <div className="relative max-w-7xl mx-auto space-y-10 px-4">
      {/* ✅ Floating scroll navigation */}
      <ScrollNav />

      {/* ✅ HERO IMAGE + Favorite Btn + Hover Overlay */}
      <div
        id="overview"
        className="group relative h-96 w-full rounded-xl overflow-hidden shadow cursor-pointer"
        onClick={() => openLightbox(0)} // ✅ Lightbox trigger
      >
        {listing.main_image ? (
          <img
            src={listing.main_image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No image available
          </div>
        )}

        {/* ❤️ Favorite Button */}
        <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow hover:scale-105 transition">
          ❤️
        </button>

        {/* 🔍 Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-5xl mb-2">🔍</span>
          <span className="text-white font-semibold text-lg tracking-wide">
            View Image
          </span>
        </div>
      </div>

      {/* ✅ Lightbox Overlay */}
      {lightboxIndex !== null && listing.images?.length > 0 && (
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
            alt={`Lightbox image ${lightboxIndex + 1}`}
          />

          <button
            className="absolute right-5 text-white text-4xl"
            onClick={nextImage}
          >
            ›
          </button>
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: Property Info */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview Section */}
          <section id="overview" className="py-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Overview</h2>
            <h1 className="text-3xl font-semibold">{listing.title}</h1>
            <p className="text-gray-600">{listing.location}</p>
            <hr className="my-4" />
            <p>{listing.description || "No description provided."}</p>
          </section>

          {/* Gallery Section */}
        {listing.images?.length > 1 && (
        <section id="gallery" className="py-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Gallery</h2>
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {listing.images.map((img: string, i: number) => (
                <div
                key={i}
                className="group relative w-full overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openLightbox(i)}
                >
                <img
                    src={img}
                    alt={`Gallery image ${i + 1}`}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* 🔍 Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-3xl mb-1">🔍</span>
                    <span className="text-white font-semibold text-sm tracking-wide">
                    View Image
                    </span>
                </div>
                </div>
            ))}
            </div>
        </section>
        )}


          {/* Map Section */}
          <section id="map" className="py-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Map</h2>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              🗺️ Map Embed Coming Soon
            </div>
          </section>

          {/* Mortgage Calculator Section */}
          <section id="mortgage" className="py-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Mortgage Calculator</h2>
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-gray-600">
                💰 Coming soon — calculate your monthly payments here.
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT: Sticky Sidebar */}
        <aside className="p-6 space-y-6 bg-white rounded-xl shadow-md h-fit sticky top-20 self-start">
          <p className="text-3xl font-bold text-green-700">
            ${listing.price?.toLocaleString() || "N/A"}
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
