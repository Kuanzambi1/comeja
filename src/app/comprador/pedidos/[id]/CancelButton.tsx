"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelButton({ pedidoId }: { pedidoId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
    setLoading(true);

    const res = await fetch(`/api/comprador/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELADO" }),
    });

    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="mt-4 w-full rounded-xl border-2 border-red-100 bg-red-50 px-6 py-4 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-200 disabled:opacity-50 transition-all"
    >
      {loading ? "Cancelando..." : "Cancelar Pedido"}
    </button>
  );
}
