const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;

const imageCache = new Map();

export const getDestinationImage = async (destination) => {
  if (imageCache.has(destination)) {
    return imageCache.get(destination);
  }

  try {
    const query = encodeURIComponent(`${destination} landscape travel`);

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${ACCESS_KEY}`
    );

    const data = await res.json();

    const image =
      data.results?.[0]?.urls?.regular ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

    imageCache.set(destination, image);

    return image;
  } catch {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
  }
};