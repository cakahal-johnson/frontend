// src/app/layout.tsx
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "RealEstateHub",
  description: "Property Listings and Buyer Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <ClientLayout>
          {/* ✅ Properly render page content */}
          <main className="p-4 max-w-6xl mx-auto">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
