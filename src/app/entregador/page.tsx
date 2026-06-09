import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import ToggleDisponivelButton from "./ToggleDisponivelButton";
import AceitarPedidoButton from "./AceitarPedidoButton";

export default async function EntregadorPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") redirect("/auth/login");

  const entregador = await prisma.entregador.findUnique({
    where: { userId: user.userId },
  });

  if (!entregador) redirect("/auth/login");

  const pedidosDisponiveis = await prisma.pedido.findMany({
    where: { status: "PRONTO", entregadorId: null },
    include: {
      restaurante: true,
      itens: { include: { produto: true } },
    },
    orderBy: { criadoEm: "asc" },
  });

  const minhasEntregas = await prisma.pedido.findMany({
    where: {
      entregadorId: user.userId,
      NOT: [{ status: "ENTREGUE" }, { status: "CANCELADO" }],
    },
    include: { restaurante: true, itens: { include: { produto: true } } },
    orderBy: { criadoEm: "desc" },
  });

  const historico = await prisma.pedido.findMany({
    where: { entregadorId: user.userId, status: "ENTREGUE" },
    orderBy: { criadoEm: "desc" },
    take: 5,
  });

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Gerencie suas entregas</p>
        </div>
        <ToggleDisponivelButton
          disponivel={entregador.disponivel}
          entregadorId={user.userId}
        />
      </div>

      {/* In progress */}
      {minhasEntregas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-soft" />
            Entrega em Andamento
          </h2>
          <div className="space-y-3">
            {minhasEntregas.map((pedido) => (
              <div key={pedido.id} className="card p-5 border-l-4 border-l-green-500 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-900">Pedido #{pedido.id}</p>
                    <p className="text-sm text-zinc-500">{pedido.restaurante.nome}</p>
                    <p className="text-sm text-zinc-500">
                      {pedido.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-900">{formatCents(pedido.totalCents)}</p>
                    <span className="badge badge-primary">{pedido.status.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available orders */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">Pedidos Disponíveis</h2>
        {pedidosDisponiveis.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🛵</div>
            <p className="text-lg font-semibold text-zinc-700">Nenhum pedido disponível</p>
            <p className="text-sm text-zinc-500 mt-1">Aguarde novos pedidos aparecerem</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosDisponiveis.map((pedido, idx) => (
              <div
                key={pedido.id}
                className="card p-5 flex items-center justify-between animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` } as React.CSSProperties}
              >
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
                <AceitarPedidoButton pedidoId={pedido.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {historico.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Últimas Entregas</h2>
          <div className="space-y-2">
            {historico.map((pedido) => (
              <div key={pedido.id} className="card p-4 flex items-center justify-between">
                <p className="font-semibold text-zinc-900">Pedido #{pedido.id}</p>
                <div className="text-right">
                  <p className="font-medium">{formatCents(pedido.totalCents)}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
