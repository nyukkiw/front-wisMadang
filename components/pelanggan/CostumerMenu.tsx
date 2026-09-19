// File untuk halaman menu pelanggan, menampilkan dashboard pelanggan

"use client";

import { useMemo, useState } from "react";

import MenuCard, { MenuItem } from "@/components/kasir/MenuCard";
import MenuFilter from "@/components/kasir/MenuFilter";
import SearchMenu from "@/components/kasir/SearchMenu";
import { dummyCategories, dummyMenus } from "@/data/dummyData";

const CUSTOMER_CART_KEY = "wis-madang-customer-cart";

export default function CostumerMenu() {
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("semua");
	const [cartMessage, setCartMessage] = useState("");

	const filteredMenus = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return dummyMenus.filter((menu) => {
			const matchesSearch = menu.name.toLowerCase().includes(normalizedSearch) || menu.description.toLowerCase().includes(normalizedSearch);
			const matchesCategory = selectedCategory === "semua" || menu.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [search, selectedCategory]);

	const addToCart = (menu: MenuItem) => {
		const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);
		const cart = savedCart ? JSON.parse(savedCart) : [];
		const existingItem = cart.find((item: MenuItem & { quantity: number; type: string }) => item.id === menu.id && item.type === "menu");

		const nextCart = existingItem
			? cart.map((item: MenuItem & { quantity: number; type: string }) => (item.id === menu.id && item.type === "menu" ? { ...item, quantity: item.quantity + 1 } : item))
			: [...cart, { ...menu, quantity: 1, type: "menu" }];

		localStorage.setItem(CUSTOMER_CART_KEY, JSON.stringify(nextCart));
		setCartMessage(`${menu.name} ditambahkan ke keranjang.`);
	};

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

			{cartMessage && <p className="rounded-xl bg-[#C08A57]/15 px-4 py-3 text-sm font-medium text-[#2C2520]">{cartMessage}</p>}

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


