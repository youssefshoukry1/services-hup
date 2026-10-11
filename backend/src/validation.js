const slug = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const fields = {
  service: ["id", "title", "icon"],
  company: ["id", "categoryId", "name", "logo", "image", "shortDesc", "address", "phone", "email", "website", "prices"],
};

export function validId(value) {
  return typeof value === "string" && value.length <= 80 && slug.test(value);
}

export function validate(kind, input, { existingId } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Body must be a JSON object." };
  const allowed = fields[kind];
  if (!allowed) throw new Error(`Unknown resource: ${kind}`);
  const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
  if (unknown.length) return { error: `Unknown field(s): ${unknown.join(", ")}.` };

  const data = { ...input };
  if (existingId && data.id !== undefined && data.id !== existingId) return { error: "The id cannot be changed." };
  data.id = existingId || data.id;
  if (!validId(data.id)) return { error: "id must be a lowercase slug (letters, digits, - or _), up to 80 characters." };

  const required = kind === "service"
    ? ["title"]
    : ["categoryId", "name", "shortDesc", "address", "phone", "email"];
  for (const key of required) {
    if (typeof data[key] !== "string" || !data[key].trim()) return { error: `${key} is required.` };
  }
  for (const key of allowed.filter((key) => !["id", "prices"].includes(key))) {
    if (data[key] !== undefined && (typeof data[key] !== "string" || data[key].length > 2000)) {
      return { error: `${key} must be a string of at most 2000 characters.` };
    }
    if (typeof data[key] === "string") data[key] = data[key].trim();
  }
  if (kind === "service") return { data: { id: data.id, title: data.title, icon: data.icon ?? "" } };

  if (!validId(data.categoryId)) return { error: "categoryId must be a valid service id." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: "email must be a valid address." };
  if (data.website) {
    try {
      if (!["http:", "https:"].includes(new URL(data.website).protocol)) throw new Error();
    } catch { return { error: "website must be an http or https URL." }; }
  }
  if (data.prices !== undefined && (!Array.isArray(data.prices) || data.prices.length > 100 || data.prices.some(
    (item) => !item || typeof item !== "object" || Array.isArray(item) ||
      Object.keys(item).some((key) => !["service", "price"].includes(key)) ||
      !["service", "price"].every((key) => typeof item[key] === "string" && item[key].trim() && item[key].length <= 200)
  ))) return { error: "prices must be an array of { service, price } strings." };

  return { data: {
    id: data.id, categoryId: data.categoryId, name: data.name,
    logo: data.logo ?? "", image: data.image ?? "", shortDesc: data.shortDesc,
    address: data.address, phone: data.phone, email: data.email,
    website: data.website ?? "", prices: data.prices?.map(({ service, price }) => ({ service: service.trim(), price: price.trim() })) ?? [],
  } };
}
