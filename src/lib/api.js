export const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getApprovedCompanies(categoryId) {
  const url = new URL("/api/companies", apiBase);
  if (categoryId) url.searchParams.set("categoryId", categoryId);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load companies.");
  return response.json();
}

export async function getApprovedCompany(id) {
  const response = await fetch(`${apiBase}/api/companies/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not load company.");
  return response.json();
}
