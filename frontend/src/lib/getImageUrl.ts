export const getImageUrl = (path?: string): string => {
  const fallback = "/no-image.png"; // ✅ local placeholder

  if (!path) return fallback;

  // Normalize full or relative URLs
  const url = path.startsWith("http")
    ? path
    : `http://127.0.0.1:8000${path}`;

  // ✅ Handle weird URLs with missing extensions
  const hasValidExt = /\.(jpe?g|png|webp|gif|svg)$/i.test(url);
  return hasValidExt ? url : `${url}.jpg`;
};
