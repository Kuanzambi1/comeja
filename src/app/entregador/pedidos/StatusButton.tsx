"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusEntrega } from "@/actions/entregador";

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
  const mounted = useRef(true);
  const [localStatus, setLocalStatus] = useState(status);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const action = statusActions[localStatus];
  if (!action) return null;

  async function handleClick() {
    const nextStatus = action.next;
    setLocalStatus(nextStatus);
    try {
      await atualizarStatusEntrega(pedidoId, nextStatus);
      router.refresh();
    } catch {
      if (mounted.current) setLocalStatus(status);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={localStatus !== status}
      className="btn-primary whitespace-nowrap shrink-0"
    >
      {localStatus !== status ? (
        <span className="flex items-center gap-1.5">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          {action.label}
        </span>
      ) : `${action.icon} ${action.label}`}
    </button>
  );
}
