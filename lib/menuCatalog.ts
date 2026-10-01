// File untuk mengelola katalog menu dan paket katering, termasuk tipe data dan fungsi utilitas

export const MENU_CATALOG_KEY = "wis-madang-menu-catalog";
export const FALLBACK_IMAGE = "/IMG Wis Madang/Nasi Goreng.jpg";

export type CatalogItemType = "menu" | "catering";

export interface CatalogItem {
  id: number;
  type: CatalogItemType;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category?: string;
  rating?: number;
  review_count?: number;
  portions?: number;
}

export function normalizeCatalogImage(src: unknown) {
  if (typeof src !== "string") {
    return FALLBACK_IMAGE;
  }

  const trimmedSrc = src.trim();

  if (trimmedSrc.startsWith("/") || trimmedSrc.startsWith("data:image/")) {
    return trimmedSrc;
  }

  try {
    const parsedUrl = new URL(trimmedSrc);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? parsedUrl.toString() : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export function getNextCatalogId(items: CatalogItem[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}
