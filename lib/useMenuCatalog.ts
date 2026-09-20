// File untuk menyimpan dan mengambil data menu dari localStorage

"use client";

import { useEffect, useState } from "react";

import { CatalogItem, defaultCatalog, MENU_CATALOG_KEY, normalizeCatalogImage } from "@/lib/menuCatalog";

export function useMenuCatalog() {
  const [catalog, setCatalog] = useState<CatalogItem[]>(defaultCatalog);

  useEffect(() => {
    const savedCatalog = localStorage.getItem(MENU_CATALOG_KEY);

    if (!savedCatalog) {
      return;
    }

    try {
      const parsedCatalog = JSON.parse(savedCatalog);
      if (Array.isArray(parsedCatalog)) {
        setCatalog(parsedCatalog.map((item) => ({ ...item, image: normalizeCatalogImage(item?.image) })));
      }
    } catch {
      localStorage.removeItem(MENU_CATALOG_KEY);
    }
  }, []);

  return catalog.filter((item) => item.available);
}
