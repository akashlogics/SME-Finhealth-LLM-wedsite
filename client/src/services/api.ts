const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getFinancialInsights(data: any) {
  const res = await fetch(`${BASE_URL}/api/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
