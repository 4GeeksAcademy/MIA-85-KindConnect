export async function fetchPostsByZip(zip, radius = 0) {
  const base = import.meta.env.VITE_BACKEND_URL;
  const url = new URL(`${base}/api/posts`);
  if (zip) url.searchParams.set("zip_code", zip); // 👈 match backend
  if (radius) url.searchParams.set("radius", radius); // optional, for later

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
}
