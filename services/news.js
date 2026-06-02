const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const ENDPOINT = "https://newsapi.org/v2/everything";
const LANGUAGE = "es";
const DOMAINS =
  "eluniversal.com.mx,milenio.com,excelsior.com.mx,elfinanciero.com.mx,record.com.mx,xataka.com.mx,expansion.mx,eleconomista.com.mx";

export const CATEGORIES = ["general", "business", "sports", "technology"];

const QUERIES = {
  general: null,
  business: "economía OR negocios OR finanzas",
  sports: "deportes OR futbol",
  technology: "tecnología OR ciencia OR salud OR medicina",
};

export async function getNews(category = "general") {
  const params = new URLSearchParams({
    domains: DOMAINS,
    language: LANGUAGE,
    sortBy: "publishedAt",
    pageSize: "50",
  });

  const query = QUERIES[category];
  if (query) {
    params.set("q", query);
  }

  const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
    headers: { "X-Api-Key": API_KEY ?? "" },
  });

  const data = await res.json();

  if (!res.ok || data.status !== "ok") {
    throw new Error(
      `NewsAPI ${res.status}: ${data.code ?? ""} ${data.message ?? ""}`.trim(),
    );
  }

  return data.articles ?? [];
}
