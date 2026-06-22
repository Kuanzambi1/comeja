import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import { AutoRefresh } from "@/app/AutoRefresh";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
  CANCELADO: { label: "Cancelado", color: "badge-danger" },
  RECEBIDO: { label: "Novo", color: "badge-warning" },
  EM_PREPARO: { label: "Preparando", color: "badge-primary" },
  PRONTO: { label: "Pronto", color: "badge-success" },
  ACEITO_ENTREGADOR: { label: "Entregador à caminho", color: "badge-primary" },
  A_CAMINHO_RESTAURANTE: { label: "Saiu para entrega", color: "badge-primary" },
  A_CAMINHO_CLIENTE: { label: "Saiu para entrega", color: "badge-primary" },
  ENTREGUE: { label: "Entregue", color: "badge-success" },
};

export default async function RestaurantePedidosPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "RESTAURANTE") redirect("/auth/login");

  const pedidos = await prisma.pedido.findMany({
    where: { restauranteId: user.userId },
    include: { itens: { include: { produto: true } } },
    orderBy: [{ status: "asc" }, { criadoEm: "desc" }],
    take: 50,
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Pedidos</h1>
        <p className="text-zinc-500 mt-1">Gerencie os pedidos do seu restaurante</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-zinc-700">Nenhum pedido recebido</h2>
          <p className="mt-2 text-zinc-500">Os pedidos aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido, idx) => {
            const status = statusConfig[pedido.status] || { label: pedido.status, color: "badge-primary" };
            return (
              <Link
                key={pedido.id}
                href={`/restaurante/pedidos/${pedido.id}`}
                className="card p-5 flex items-center justify-between hover:-translate-y-0.5 animate-fade-in group"
                style={{ animationDelay: `${idx * 40}ms` } as React.CSSProperties}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      Pedido #{pedido.id}
                    </p>
                    <span className={`badge ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    {pedido.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {new Date(pedido.criadoEm).toLocaleString("pt")}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-zinc-900">{formatCents(pedido.totalCents)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <AutoRefresh intervalMs={10000} />
    </div>
  );
}
