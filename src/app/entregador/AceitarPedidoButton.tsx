"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AceitarPedidoButton({
  pedidoId,
}: {
  pedidoId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    const res = await fetch(`/api/entregador/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "aceitar" }),
    });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="btn-primary whitespace-nowrap shrink-0"
    >
      {loading ? "..." : "Aceitar Entrega"}
    </button>
  );
}
