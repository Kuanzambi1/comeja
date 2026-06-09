import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import StatusButton from "./StatusButton";

export default async function EntregadorPedidosPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") redirect("/auth/login");

  const pedidos = await prisma.pedido.findMany({
    where: { entregadorId: user.userId },
    include: { restaurante: true, itens: { include: { produto: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Minhas Entregas</h1>
        <p className="text-zinc-500 mt-1">Histórico completo de entregas</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🛵</div>
          <h2 className="text-xl font-bold text-zinc-700">Nenhuma entrega</h2>
          <p className="mt-2 text-zinc-500">Você ainda não realizou nenhuma entrega</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido, idx) => (
            <div
              key={pedido.id}
              className="card p-5 animate-fade-in"
              style={{ animationDelay: `${idx * 40}ms` } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-zinc-900">Pedido #{pedido.id}</p>
                  <p className="text-sm text-zinc-500">{pedido.restaurante.nome}</p>
                  <p className="text-sm text-zinc-500 truncate">
                    {pedido.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                  </p>
                  <p className="text-base font-bold text-orange-600 mt-1">
                    {formatCents(pedido.totalCents)}
                  </p>
                </div>
                <StatusButton pedidoId={pedido.id} status={pedido.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
