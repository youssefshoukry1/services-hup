import { apiBase } from "./api";

const fallback = {
  painters: "/images/services/painting-service.webp",
  cleaning: "/images/services/cleaning-service.webp",
  auto_repair: "/images/services/car-repair-service.webp",
};

export function companyAsset(value, categoryId) {
  if (!value) return fallback[categoryId] || "/images/services/painting-service.webp";
  if (value.startsWith("/uploads/")) return `${apiBase}${value}`;
  return value;
}
