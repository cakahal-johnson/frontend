// frontend/src/lib/getImageUrl.ts
export const getImageUrl = async (path?: string): Promise<string> => {
  const fallback = "/no-image.png"; // ✅ local placeholder

  if (!path) return fallback;

  // Normalize full or relative URLs
  const url = path.startsWith("http")
    ? path
    : `http://127.0.0.1:8000${path}`;

  try {
    // ✅ Check if image URL actually exists (HEAD = fast check)
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      console.warn(`⚠️ Image not found: ${url}`);
      return fallback;
    }

    // ✅ Handle weird URLs with missing extension (rare but possible)
    const hasValidExt = /\.(jpe?g|png|webp|gif|svg)$/i.test(url);
    if (!hasValidExt) return `${url}.jpg`;

    return url;
  } catch (err) {
    console.error("❌ Image fetch error:", err);
    return fallback;
  }
};

