"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { aceitarPedido } from "@/actions/entregador";

export default function AceitarPedidoButton({
  pedidoId,
}: {
  pedidoId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    try {
      await aceitarPedido(pedidoId);
      router.refresh();
    } catch {
      setLoading(false);
    }
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
