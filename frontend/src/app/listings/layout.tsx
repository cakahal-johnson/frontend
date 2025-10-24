// frontend/src/app/listings/layout.tsx
"use client";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="flex-1 ml-0 lg:ml-64 bg-gray-50 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}
