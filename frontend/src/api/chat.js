const BASE = "http://localhost:8000/api";

export async function sendMessage({ sessionId, message, denomination }) {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      denomination
    })
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
  // Returns: { reply, route_used, verses_fetched, warning }
}
