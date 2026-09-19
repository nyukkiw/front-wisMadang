"use client";

import { useEffect, useState } from "react";

export const CUSTOMER_CART_KEY = "wis-madang-customer-cart";
export const CUSTOMER_CART_UPDATED_EVENT = "wis-madang-cart-updated";

export function notifyCustomerCartUpdated() {
  window.dispatchEvent(new Event(CUSTOMER_CART_UPDATED_EVENT));
}

function readCartCount() {
  try {
    const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);
    const cart = savedCart ? JSON.parse(savedCart) : [];

    return Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;
  } catch {
    return 0;
  }
}

export function useCustomerCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(readCartCount());

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener(CUSTOMER_CART_UPDATED_EVENT, updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener(CUSTOMER_CART_UPDATED_EVENT, updateCount);
    };
  }, []);

  return count;
}

interface CartBadgeProps {
  showIcon?: boolean;
}

export function CartBadge({ showIcon = true }: CartBadgeProps) {
  const count = useCustomerCartCount();

  return (
    <span className="relative inline-flex items-center">
      {showIcon && <span aria-hidden="true">🛒</span>}
      {count > 0 && (
        <span className="absolute -right-3 -top-3 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#E03E3E] px-1 text-[10px] font-bold leading-none text-white shadow-md">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

interface CartToastProps {
  message: string;
  onClose: () => void;
}

export function CartToast({ message, onClose }: CartToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(20rem,calc(100vw-2rem))] max-w-sm animate-[cart-toast-in_220ms_ease-out] rounded-2xl border border-[#E9785F]/40 bg-[#174a43] p-4 text-white shadow-2xl" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9785F] text-lg" aria-hidden="true">
          ✓
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F4C6A5]">Masuk ke keranjang</p>
          <p className="mt-1 truncate text-sm font-bold">{message}</p>
        </div>
        <button type="button" onClick={onClose} className="text-lg leading-none text-white/70 hover:text-white" aria-label="Tutup notifikasi">
          ×
        </button>
      </div>
    </div>
  );
}
