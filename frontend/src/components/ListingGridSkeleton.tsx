// src/components/ListingGridSkeleton.tsx
export default function ListingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-40 bg-gray-200 rounded-lg" />
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
