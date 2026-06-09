"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  pedidoId: number;
  status: string;
};

const statusActions: Record<string, { label: string; next: string; icon: string }> = {
  ACEITO_ENTREGADOR: { label: "A caminho do restaurante", next: "A_CAMINHO_RESTAURANTE", icon: "🏪" },
  A_CAMINHO_RESTAURANTE: { label: "A caminho do cliente", next: "A_CAMINHO_CLIENTE", icon: "📍" },
  A_CAMINHO_CLIENTE: { label: "Confirmar Entrega", next: "ENTREGUE", icon: "✅" },
};

export default function StatusButton({ pedidoId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const action = statusActions[status];
  if (!action) return null;

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/entregador/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", status: action.next }),
    });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary whitespace-nowrap shrink-0"
    >
      {loading ? "..." : `${action.icon} ${action.label}`}
    </button>
  );
}
