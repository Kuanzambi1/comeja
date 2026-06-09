"use client";

import { useRouter } from "next/navigation";

export default function ToggleEntregadorButton({
  entregadorId,
}: {
  entregadorId: number;
}) {
  const router = useRouter();

  async function handleDeactivate() {
    const res = await fetch("/api/admin/entregadores", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entregadorId, disponivel: false }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={handleDeactivate}
      className="btn-ghost text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      Desativar
    </button>
  );
}
