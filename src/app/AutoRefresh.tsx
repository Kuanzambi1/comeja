"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TERMINAL_STATUSES = new Set(["ENTREGUE", "CANCELADO", "CANCELED"]);

export function AutoRefresh({
  intervalMs = 8000,
  status,
}: {
  intervalMs?: number;
  status?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (status && TERMINAL_STATUSES.has(status)) return;

    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs, status]);

  return null;
}
