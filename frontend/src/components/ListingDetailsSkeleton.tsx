// src/components/ListingDetailsSkeleton.tsx
export default function ListingDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse space-y-8">
      <div className="h-96 bg-gray-300 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-6 bg-gray-300 rounded w-2/3" />
      <div className="h-5 bg-gray-200 rounded w-full" />
      <div className="h-5 bg-gray-200 rounded w-full" />
    </div>
  );
}
