// File untuk menyimpan data dummy sebelum ada data aseli

export const dummyUsers = [
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
  {
    id: 1,
    name: "Makanan",
  },
  {
    id: 2,
    name: "Minuman",
  },
  {
    id: 3,
    name: "Snack",
  },
];

export const dummyMenus = [
  {
    id: 1,
    name: "Nasi Goreng",
    category_id: 1,
    price: 15000,
    stock: 20,
    image: "IMG Wis Madang//Nasi Goreng.jpg",
    description: "Nasi goreng dengan telur dan sayuran.",
  },
  {
    id: 2,
    name: "Nasi Putih",
    category_id: 1,
    price: 13000,
    stock: 15,
    image: "IMG Wis Madang//Nasi Putih.jpg",
    description: "Nasi putih biasa.",
  },
  {
    id: 3,
    name: "Es Teh",
    category_id: 2,
    price: 5000,
    stock: 30,
    image: "IMG Wis Madang//Es Teh.jpg",
    description: "Es teh manis segar.",
  },
  {
    id: 4,
    name: "Kopi Hitam",
    category_id: 2,
    price: 10000,
    stock: 25,
    image: "IMG Wis Madang//Kopi Hitam.jpg",
    description: "Kopi hitam dengan rasa kuat.",
  },
  {
    id: 5,
    name: "Tahu Goreng",
    category_id: 3,
    price: 8000,
    stock: 10,
    image: "IMG Wis Madang//Tahu Goreng.jpg",
    description: "Tahu goreng renyah.",
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
