"use client";

import { useRouter } from "next/navigation";

export default function ToggleRestauranteButton({
  restauranteId,
  disponivel,
}: {
  restauranteId: number;
  disponivel: boolean;
}) {
  const router = useRouter();

  async function handleToggle() {
    const res = await fetch("/api/admin/restaurantes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restauranteId, disponivel: !disponivel }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className={`btn-ghost text-sm font-semibold ${
        disponivel
          ? "text-red-500 hover:text-red-700 hover:bg-red-50"
          : "text-green-500 hover:text-green-700 hover:bg-green-50"
      }`}
    >
      {disponivel ? "Suspender" : "Ativar"}
    </button>
  );
}
