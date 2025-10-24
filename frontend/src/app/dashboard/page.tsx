"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) router.push("/auth/login");
    else setRole(user.role);
  }, [router]);

  if (!role) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700">Welcome to your Dashboard</h1>
      <p className="mt-2 text-gray-600">
        You are logged in as <strong>{role}</strong>. 
        {role === "agent"
          ? " Manage your listings and view sales orders."
          : " View your orders and favorite properties."}
      </p>
    </div>
  );
}
