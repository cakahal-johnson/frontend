"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

export default function DashboardSidebar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setRole(user.role);
  }, []);

  const buyerLinks = [
    { href: "/dashboard/buyer", label: "My Purchases" },
    { href: "/dashboard/favorites", label: "Favorites" },
    { href: "/listings", label: "Browse Listings" },
  ];

  const agentLinks = [
    { href: "/dashboard/agent", label: "My Listings" },
    { href: "/dashboard/agent/add", label: "Add Listing" },
    { href: "/dashboard/agent/orders", label: "Orders" },
  ];

  const commonLinks = [{ href: "/dashboard/profile", label: "Profile Settings" }];

  const links = role === "agent" ? agentLinks : buyerLinks;

  return (
    <aside className="bg-white shadow-lg w-64 h-full p-4 flex flex-col gap-3 border-r border-gray-200">
      <h2 className="font-bold text-lg text-indigo-700 mb-2">Dashboard</h2>
      {[...links, ...commonLinks].map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
