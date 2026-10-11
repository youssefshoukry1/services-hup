import { mockData } from "../../mockData.js";

const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase("de-DE")
  .replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ß", "ss");

export function searchCompanies(query, companies) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return { categories: [], companies: [] };
  const matches = (value) => terms.every((term) => normalize(value).includes(term));
  const categories = mockData.categories.filter((category) => matches(`${category.title} ${category.id.replaceAll("_", " ")}`));
  const results = companies.filter((company) => {
    const category = mockData.categories.find((item) => item.id === company.categoryId);
    return matches([company.name, company.shortDesc, company.address, category?.title,
      category?.id.replaceAll("_", " "), ...(company.prices ?? []).map((item) => item.service)].join(" "));
  }).sort((first, second) => {
    const score = (company) => normalize(company.name).startsWith(normalize(query)) ? 2 : normalize(company.name).includes(normalize(query)) ? 1 : 0;
    return score(second) - score(first) || first.name.localeCompare(second.name, "de-DE");
  });
  return { categories, companies: results };
}
