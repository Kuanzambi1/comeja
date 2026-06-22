import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import { AutoRefresh } from "@/app/AutoRefresh";
import ToggleDisponivelButton from "./ToggleDisponivelButton";
import AceitarPedidoButton from "./AceitarPedidoButton";

export default async function EntregadorPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") redirect("/auth/login");

  const entregador = await prisma.entregador.findUnique({
    where: { userId: user.userId },
  });

  if (!entregador) redirect("/auth/login");

  const [pedidosDisponiveis, minhasEntregas, historico] = await Promise.all([
    prisma.pedido.findMany({
      where: { status: "PRONTO", entregadorId: null },
      include: { restaurante: true, itens: { include: { produto: true } } },
      orderBy: { criadoEm: "asc" },
    }),
    prisma.pedido.findMany({
      where: { entregadorId: user.userId, NOT: [{ status: "ENTREGUE" }, { status: "CANCELADO" }] },
      include: { restaurante: true, itens: { include: { produto: true } } },
      orderBy: { criadoEm: "desc" },
    }),
    prisma.pedido.findMany({
      where: { entregadorId: user.userId, status: "ENTREGUE" },
      orderBy: { criadoEm: "desc" },
      take: 5,
    }),
  ]);

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
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Entrega em Andamento
          </h2>
          <div className="space-y-3">
            {minhasEntregas.map((pedido) => (
              <div key={pedido.id} className="card p-5 border-l-4 border-l-green-500 animate-fade-in hover:-translate-y-0.5 transition-all duration-200">
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
                    <span className="badge badge-primary mt-1">{pedido.status.replace(/_/g, " ")}</span>
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
            </div>
            <p className="text-lg font-semibold text-zinc-700">Nenhum pedido disponível</p>
            <p className="text-sm text-zinc-500 mt-1">Aguarde novos pedidos aparecerem</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosDisponiveis.map((pedido, idx) => (
              <div
                key={pedido.id}
                className="card p-5 flex items-center justify-between animate-fade-in hover:-translate-y-0.5 transition-all duration-200"
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
                    {new Date(pedido.criadoEm).toLocaleDateString("pt")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AutoRefresh intervalMs={10000} />
    </div>
  );
}
