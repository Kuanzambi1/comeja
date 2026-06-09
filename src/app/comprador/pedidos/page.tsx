import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
  CANCELADO: { label: "Cancelado", color: "badge-danger" },
  RECEBIDO: { label: "Recebido", color: "badge-warning" },
  EM_PREPARO: { label: "Em preparo", color: "badge-warning" },
  PRONTO: { label: "Pronto", color: "badge-primary" },
  ACEITO_ENTREGADOR: { label: "Saiu para entrega", color: "badge-primary" },
  A_CAMINHO_RESTAURANTE: { label: "Saiu para entrega", color: "badge-primary" },
  A_CAMINHO_CLIENTE: { label: "Saiu para entrega", color: "badge-primary" },
  ENTREGUE: { label: "Entregue", color: "badge-success" },
};

export default async function PedidosPage() {
  const user = await getAuthUser();
  if (!user) redirect("/auth/login");

  const pedidos = await prisma.pedido.findMany({
    where: { compradorId: user.userId },
    include: {
      restaurante: true,
      itens: { include: { produto: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">Meus Pedidos</h1>
      <p className="text-zinc-500 mb-8">Acompanhe todos os seus pedidos</p>

      {pedidos.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-zinc-700">Nenhum pedido ainda</h2>
          <p className="mt-2 text-zinc-500">Faça seu primeiro pedido agora</p>
          <Link href="/comprador" className="btn-primary mt-6 inline-flex">
            Ver Restaurantes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido, idx) => {
            const status = statusConfig[pedido.status] || { label: pedido.status, color: "badge-primary" };
            return (
              <Link
                key={pedido.id}
                href={`/comprador/pedidos/${pedido.id}`}
                className="card p-5 flex items-center justify-between hover:-translate-y-0.5 animate-fade-in group"
                style={{ animationDelay: `${idx * 60}ms` } as React.CSSProperties}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl">
                    🏪
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {pedido.restaurante.nome}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">
                      {pedido.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {new Date(pedido.criadoEm).toLocaleDateString("pt-BR", {
                        day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-zinc-900">{formatCents(pedido.totalCents)}</p>
                  <span className={`badge mt-1 ${status.color}`}>{status.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
