// components/ScrollNav.tsx
"use client";
import { useEffect, useState } from "react";
import { Home, Image, MapPin, Calculator } from "lucide-react";

export default function ScrollNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
  const sections = ["overview", "gallery", "map", "mortgage"];

  const handleScroll = () => {
    const scrollY = window.scrollY;
    let current = "";
    for (let id of sections) {
      const el = document.getElementById(id);
      if (el && scrollY >= el.offsetTop - window.innerHeight / 3) {
        current = id;
      }
    }
    setActive(current);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // initialize on mount
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const links = [
    { id: "overview", icon: <Home size={18} />, label: "Overview" },
    { id: "gallery", icon: <Image size={18} />, label: "Gallery" },
    { id: "map", icon: <MapPin size={18} />, label: "Map" },
    { id: "mortgage", icon: <Calculator size={18} />, label: "Mortgage" },
  ];

  return (
    <div className="fixed right-4 top-1/3 bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-2 flex flex-col space-y-2 border">
      {links.map(link => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            active === link.id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
          }`}
        >
          {link.icon}
          <span className="text-sm">{link.label}</span>
        </a>
      ))}
    </div>
  );
}
