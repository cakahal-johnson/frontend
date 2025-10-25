"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import { Home, Heart, List, PlusCircle, Settings, ShoppingBag } from "lucide-react";

export default function DashboardSidebar() {
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setRole(user.role);
  }, []);

  const buyerLinks = [
    { href: "/dashboard/orders", label: "My Purchases", icon: ShoppingBag },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/listings", label: "Browse Listings", icon: List },
  ];

  const agentLinks = [
    { href: "/dashboard/agent", label: "My Listings", icon: List },
    { href: "/dashboard/agent/add", label: "Add Listing", icon: PlusCircle },
    { href: "/dashboard/agent/orders", label: "Orders", icon: ShoppingBag },
  ];

  const commonLinks = [{ href: "/dashboard/profile", label: "Profile Settings", icon: Settings }];
  const links = role === "agent" ? agentLinks : buyerLinks;

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-3 text-gray-700 fixed top-20 left-2 z-50 bg-white rounded-md shadow"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`
          bg-white border-r border-gray-200 shadow-sm w-64 h-[calc(100vh-80px)] p-5 flex flex-col justify-between
          fixed top-20 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-64"}
          lg:translate-x-0 lg:static
        `}
      >
        <div>
          <h2 className="font-bold text-lg text-indigo-700 mb-4">Dashboard</h2>
          <nav className="space-y-2">
            {[...links, ...commonLinks].map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="text-xs text-gray-400 text-center mt-6">
          © 2025 RealEstateHub
        </div>
      </aside>
    </>
  );
}
