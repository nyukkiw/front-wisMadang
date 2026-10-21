// File untuk mengelola katalog menu dan paket katering, termasuk tipe data dan fungsi utilitas

export const FALLBACK_IMAGE = "/IMG Wis Madang/Nasi Goreng.jpg";

export type JenisItemKatalog = "menu" | "catering";

export interface ItemKatalog {
  id: number;
  type: JenisItemKatalog;
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

export function rapikanGambarKatalog(src: unknown) {
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
