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
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">
        {title}
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {listings.map((fav) => (
          <ListingCard key={fav.id} listing={fav.listing} />
        ))}
      </div>
    </section>
  );
}
