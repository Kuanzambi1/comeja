"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StatusButton({
  pedidoId,
  nextStatus,
}: {
  pedidoId: number;
  nextStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const config: Record<string, { label: string; icon: string }> = {
    EM_PREPARO: { label: "Iniciar Preparo", icon: "👨‍🍳" },
    PRONTO: { label: "Marcar como Pronto", icon: "✅" },
  };

  const action = config[nextStatus] || { label: nextStatus, icon: "→" };

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/restaurante/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary w-full py-4 text-base"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Processando...
        </span>
      ) : `${action.icon} ${action.label}`}
    </button>
  );
}
