// File untuk halaman menu pelanggan, menampilkan dashboard pelanggan

"use client";

import { useEffect, useMemo, useState } from "react";

import MenuCard, { MenuItem } from "@/components/kasir/MenuCard";
import MenuFilter from "@/components/kasir/MenuFilter";
import SearchMenu from "@/components/kasir/SearchMenu";
import { dummyCategories } from "@/data/dummyData";
import { CartToast, CUSTOMER_CART_KEY, notifyCustomerCartUpdated } from "@/components/pelanggan/CartNotification";
import { useMenuCatalog } from "@/lib/useMenuCatalog";
import { useAuth } from "@/components/auth/AuthProvider";

export default function CostumerMenu() {
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("semua");
	const [cartMessage, setCartMessage] = useState("");
	const { session, openLogin } = useAuth();
	const catalog = useMenuCatalog();
	const menuItems = catalog.filter((item) => item.type === "menu").map((item) => ({ ...item, category: item.category ?? "lainnya", rating: item.rating ?? 0, review_count: item.review_count ?? 0, apakah_laris: item.apakah_laris ?? false }));

	const filteredMenus = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return menuItems.filter((menu) => {
			const matchesSearch = menu.name.toLowerCase().includes(normalizedSearch) || menu.description.toLowerCase().includes(normalizedSearch);
			const matchesCategory = selectedCategory === "semua" || menu.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [menuItems, search, selectedCategory]);

	const addToCart = (menu: MenuItem) => {
		if (!session || session.peran !== "pelanggan") {
			openLogin();
			return;
		}

		const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);
		const cart = savedCart ? JSON.parse(savedCart) : [];
		const existingItem = cart.find((item: MenuItem & { quantity: number; type: string }) => item.id === menu.id && item.type === "menu");

		const nextCart = existingItem
			? cart.map((item: MenuItem & { quantity: number; type: string }) => (item.id === menu.id && item.type === "menu" ? { ...item, quantity: item.quantity + 1 } : item))
			: [...cart, { ...menu, quantity: 1, type: "menu" }];

		localStorage.setItem(CUSTOMER_CART_KEY, JSON.stringify(nextCart));
		notifyCustomerCartUpdated();
		setCartMessage(`${menu.name} ditambahkan ke keranjang.`);
	};

	useEffect(() => {
		if (!cartMessage) {
			return;
		}

		const timeoutId = window.setTimeout(() => setCartMessage(""), 3200);
		return () => window.clearTimeout(timeoutId);
	}, [cartMessage]);

	return (
		<section className="space-y-6">
			<header>
				<h1 className="text-2xl font-bold text-[#2C2520]">Menu WIS MADANG</h1>
				<p className="mt-2 text-[#2C2520]/65">Pilih menu favoritmu dan tambahkan ke keranjang.</p>
			</header>

			<div className="space-y-4">
				<SearchMenu value={search} onChange={setSearch} />
				<MenuFilter categories={dummyCategories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
			</div>

			<CartToast message={cartMessage} onClose={() => setCartMessage("")} />

			{filteredMenus.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredMenus.map((menu) => (
						<MenuCard key={menu.id} menu={menu} onAdd={addToCart} />
					))}
				</div>
			) : (
				<div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-10 text-center">
					<p className="font-semibold text-[#2C2520]">Menu tidak ditemukan</p>
					<p className="mt-1 text-sm text-[#2C2520]/65">Coba gunakan kata kunci atau kategori lain.</p>
				</div>
			)}
		</section>
	);
}


