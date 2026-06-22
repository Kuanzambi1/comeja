import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import { AutoRefresh } from "@/app/AutoRefresh";
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
    take: 50,
  });

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">Meus Pedidos</h1>
      <p className="text-zinc-500 mb-8">Acompanhe todos os seus pedidos</p>

      {pedidos.length === 0 ? (
        <div className="card-premium p-16 text-center max-w-lg mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
            <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </div>
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
                className="card p-5 flex items-center justify-between hover:-translate-y-0.5 animate-fade-in group transition-all duration-200"
                style={{ animationDelay: `${idx * 60}ms` } as React.CSSProperties}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {pedido.restaurante.nome}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">
                      {pedido.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {new Date(pedido.criadoEm).toLocaleDateString("pt", {
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

      <AutoRefresh intervalMs={10000} />
    </div>
  );
}
