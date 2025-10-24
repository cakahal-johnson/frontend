"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AgentDashboard() {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    api.get("/listings/me").then((res) => setListings(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">My Listings</h2>
      {listings.length === 0 ? (
        <p className="text-gray-500">No listings created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-800">{listing.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{listing.location}</p>
              <p className="text-indigo-600 mt-2 font-semibold">${listing.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
