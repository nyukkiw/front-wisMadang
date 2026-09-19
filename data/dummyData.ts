// File untuk menyimpan data dummy sebelum ada data aseli

export const dummyUsers = [
  // Mock data user
  {
    id: 1,
    name: "Budi",
    email: "budi@wismadang.com",
    password: "budi123",
    role: "kasir",
  },
  {
    id: 2,
    name: "Mas Banyuk",
    email: "nyuk@gmail.com",
    password: "Nyuk123",
    role: "pelanggan",
  },
  {
    id: 3,
    name: "Admin Wis Madang",
    email: "admin@wismadang.com",
    password: "admin123",
    role: "admin",
  },
];

export const dummyCategories = [
  // Mock data kategori
  {
    id: "semua",
    name: "Semua",
  },
  {
    id: "nasi",
    name: "Nasi",
  },
  {
    id: "lauk",
    name: "Lauk",
  },
  {
    id: "sayur",
    name: "Sayur",
  },
  {
    id: "minuman",
    name: "Minuman",
  },
];

export const dummyMenus = [
  // Mock data menu
  {
    id: 1,
    name: "Nasi Goreng",
    category: "nasi",
    price: 15000,
    rating: 4.5,
    review_count: 120,
    available: true,
    apakah_laris: true,
    image: "/IMG Wis Madang/Nasi Goreng.jpg",
    description: "Nasi goreng dengan telur dan sayuran.",
  },
  {
    id: 2,
    name: "Nasi Putih",
    category: "nasi",
    price: 13000,
    rating: 4.2,
    review_count: 95,
    available: true,
    apakah_laris: false,
    image: "/IMG Wis Madang/Nasi Putih.jpg",
    description: "Nasi putih biasa.",
  },
  {
    id: 3,
    name: "Es Teh",
    category: "minuman",
    price: 5000,
    rating: 4.0,
    review_count: 80,
    available: true,
    apakah_laris: false,
    image: "/IMG Wis Madang/Es Teh.jpg",
    description: "Es teh manis segar.",
  },
  {
    id: 4,
    name: "Kopi Hitam",
    category: "minuman",
    price: 10000,
    rating: 4.3,
    review_count: 110,
    available: true,
    apakah_laris: true,
    image: "/IMG Wis Madang/Kopi Hitam.jpg",
    description: "Kopi hitam dengan rasa kuat.",
  },
  {
    id: 5,
    name: "Tahu Goreng",
    category: "lauk",
    price: 8000,
    rating: 4.1,
    review_count: 75,
    available: true,
    apakah_laris: false,
    image: "/IMG Wis Madang/Tahu Goreng.jpg",
    description: "Tahu goreng renyah.",
  },
  {
    id: 6,
    name: "Tempe Goreng",
    category: "lauk",
    price: 6000,
    rating: 4.4,
    review_count: 38,
    available: true,
    apakah_laris: false,
    image: "/IMG Wis Madang/Tempe Goreng.jpg",
    description: "Tempe goreng renyah dan gurih.",
  },
  {
    id: 7,
    name: "Es Jeruk",
    category: "minuman",
    price: 5000,
    rating: 4.2,
    review_count: 60,
    available: true,
    apakah_laris: false,
    image: "/IMG Wis Madang/Es Jeruk.jpg",
    description: "Es jeruk segar dan lezat.",
  },
  {
    id: 8,
    name: "Gurame Goreng",
    category: "lauk",
    price: 25000,
    rating: 4.5,
    review_count: 45,
    available: true,
    apakah_laris: false,
    image: "/IMG Wis Madang/Gurame Goreng.jpg",
    description: "Gurame goreng renyah dan lezat.",
  },
];

export const dummyOrders = [
  {
    id: 1001,
    customer_id: 2,
    customer_name: "Mas Banyuk",
    date: "2026-09-12",
    status: "selesai",
    payment_method: "QRIS",
    total: 30000,
    items: [
      {
        menu_id: 1,
        menu_name: "Nasi Goreng",
        quantity: 1,
        price: 15000,
        subtotal: 15000,
      },
      {
        menu_id: 3,
        menu_name: "Es Teh",
        quantity: 1,
        price: 3000,
        subtotal: 3000,
      },
      {
        menu_id: 5,
        menu_name: "Tahu Goreng",
        quantity: 1,
        price: 5000,
        subtotal: 5000,
      },
    ],
  },
];

export const dummyCateringPackages = [
  {
    id: 1,
    name: "Paket Hemat Keluarga",
    description: "Nasi, ayam, sayur, sambal, dan minuman.",
    price: 85000,
    portions: 4,
    image: "/IMG Wis Madang/Nasi Box.jpg",
  },
  {
    id: 2,
    name: "Paket Rapat",
    description: "Paket makan siang untuk acara kantor.",
    price: 150000,
    portions: 8,
    image: "/IMG Wis Madang/Prasmanan.jpg",
  },
  {
    id: 3,
    name: "Paket Acara Besar",
    description: "Paket catering prasmanan untuk acara keluarga.",
    price: 350000,
    portions: 20,
    image: "/IMG Wis Madang/Prasmanan.jpg",
  },
];

export const dummyPromos = [
  {
    id: 1,
    title: "Diskon Menu Minuman",
    description: "Diskon 20% untuk semua minuman hari ini.",
    discount: "20%",
  },
];
