const BASE = "http://localhost:8000/api";

export async function generateImage(prompt) {
  const res = await fetch(`${BASE}/generate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error("Image request failed");
  return res.json();
  // Returns: { image_url, safe_prompt, original_prompt, blocked }
}
