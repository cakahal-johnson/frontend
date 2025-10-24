// src/app/dashboard/favorites/favoritesGroup.tsx
import ListingCard from "@/components/ListingCard";
import { FavoriteResponse } from "@/types/favorite";

export default function FavoritesGroup({
  title,
  listings,
}: {
  title: string;
  listings: FavoriteResponse[];
}) {
  return (
    <section className="mb-10 animate-fadeIn">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">
        {title}
      </h2>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all">
        {listings.map((fav) => (
          <ListingCard
            key={fav.id}
            listing={fav.listing}
            favoriteId={fav.id}
          />
        ))}
      </div>
    </section>
  );
}
