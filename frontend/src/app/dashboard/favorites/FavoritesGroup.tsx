// src/app/favorites/favoritesGroup.tsx  
import ListingCard from "@/components/ListingCard";

export default function FavoritesGroup({ title, listings }: { title: string; listings: any[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">{title}</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {listings.map((fav) => (
          <ListingCard key={fav.id} listing={fav.listing} />
        ))}
      </div>
    </div>
  );
}
