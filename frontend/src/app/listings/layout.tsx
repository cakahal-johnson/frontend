// frontend/src/app/listings/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDetailPage = /^\/listings\/\d+/.test(pathname); // e.g. /listings/12

  return (
    <div className={`flex ${isDetailPage ? "justify-center" : ""}`}>
      {/* ✅ Show sidebar only if NOT in details page */}
      {!isDetailPage && <DashboardSidebar />}

      <main
        className={`flex-1 bg-gray-50 min-h-screen p-6 transition-all duration-300 ${
          isDetailPage ? "ml-0 max-w-7xl" : "ml-0 lg:ml-24"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

