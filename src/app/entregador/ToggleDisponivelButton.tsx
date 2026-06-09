"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleDisponivelButton({
  disponivel,
}: {
  disponivel: boolean;
  entregadorId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await fetch("/api/entregador/disponivel", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponivel: !disponivel }),
    });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all ${
        disponivel
          ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
          : "bg-green-50 text-green-600 hover:bg-green-100 border-2 border-green-200"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${disponivel ? "bg-red-500" : "bg-green-500"} animate-pulse-soft`} />
      {loading ? "..." : disponivel ? "Ficar Indisponível" : "Ficar Disponível"}
    </button>
  );
}
