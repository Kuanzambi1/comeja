"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RealtimeProvider() {
  const router = useRouter();

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      es = new EventSource("/api/realtime");
      es.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (
            event.tipo === "pedido_atualizado" ||
            event.tipo === "status_alterado" ||
            event.tipo === "disponivel_alterado"
          ) {
            router.refresh();
          }
        } catch {}
      };
      es.onerror = () => {
        es?.close();
        reconnectTimer = setTimeout(connect, 5000);
      };
    }

    connect();
    return () => {
      es?.close();
      clearTimeout(reconnectTimer);
    };
  }, [router]);

  return null;
}
