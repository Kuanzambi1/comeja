"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusPedido } from "@/actions/restaurante";

const config: Record<string, { label: string; icon: string }> = {
  EM_PREPARO: { label: "Iniciar Preparo", icon: "👨‍🍳" },
  PRONTO: { label: "Marcar como Pronto", icon: "✅" },
};

export default function StatusButton({
  pedidoId,
  nextStatus,
}: {
  pedidoId: number;
  nextStatus: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => { setDone(false); }, [nextStatus]);

  const action = config[nextStatus] || { label: nextStatus, icon: "→" };

  async function handleClick() {
    setDone(true);
    try {
      await atualizarStatusPedido(pedidoId, nextStatus);
      router.refresh();
    } catch {
      setDone(false);
    }
  }

  if (done) return null;

  return (
    <button
      onClick={handleClick}
      className="btn-primary w-full py-4 text-base"
    >
      {`${action.icon} ${action.label}`}
    </button>
  );
}
