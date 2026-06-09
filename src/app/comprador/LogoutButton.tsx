"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="btn-ghost text-sm text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      Sair
    </button>
  );
}
