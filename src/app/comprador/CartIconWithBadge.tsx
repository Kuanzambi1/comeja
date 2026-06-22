"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CartItem = {
  quantidade: number;
};

export function dispatchCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

function getCartCount(): number {
  try {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
  } catch {
    return 0;
  }
}

export function CartIconWithBadge({ href, children }: { href: string; children: React.ReactNode }) {
  const [count, setCount] = useState(getCartCount);

  useEffect(() => {
    const handler = () => setCount(getCartCount());
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return (
    <Link href={href} className="relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition-all">
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function MobileCartIconWithBadge({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const [count, setCount] = useState(getCartCount);

  useEffect(() => {
    const handler = () => setCount(getCartCount());
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return (
    <Link href={href} className="relative flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium text-zinc-500">
      <span className="text-xl flex items-center justify-center text-zinc-400">
        {children}
        {count > 0 && (
          <span className="absolute -top-0.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white shadow-sm">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
      {label}
    </Link>
  );
}
