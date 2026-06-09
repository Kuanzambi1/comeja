"use client";

import { useRouter } from "next/navigation";

export default function ToggleProdutoButton({
  produtoId,
  disponivel,
}: {
  produtoId: number;
  disponivel: boolean;
}) {
  const router = useRouter();

  async function handleToggle() {
    const res = await fetch("/api/restaurante/produtos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produtoId, disponivel: !disponivel }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className={`btn-ghost text-sm ${
        disponivel ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"
      }`}
    >
      {disponivel ? "Desativar" : "Ativar"}
    </button>
  );
}
