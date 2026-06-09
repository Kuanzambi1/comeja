import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  CANCELADO: "Cancelado",
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em preparo",
  PRONTO: "Pronto",
  ACEITO_ENTREGADOR: "Entregador a caminho",
  A_CAMINHO_RESTAURANTE: "Saiu para entrega",
  A_CAMINHO_CLIENTE: "Saiu para entrega",
  ENTREGUE: "Entregue",
};

export default async function RestauranteDashboard() {
  const user = await getAuthUser();
  if (!user) redirect("/auth/login");

  const restaurante = await prisma.restaurante.findUnique({
    where: { userId: user.userId },
  });

  if (!restaurante) redirect("/auth/login");

  const produtosCount = await prisma.produto.count({
    where: { restauranteId: user.userId },
  });

  const pedidosCount = await prisma.pedido.count({
    where: { restauranteId: user.userId },
  });

  const pedidosPendentes = await prisma.pedido.count({
    where: { restauranteId: user.userId, status: "RECEBIDO" },
  });

  const faturamento = await prisma.pedido.aggregate({
    where: { restauranteId: user.userId, status: "ENTREGUE" },
    _sum: { totalCents: true },
  });

  const ultimosPedidos = await prisma.pedido.findMany({
    where: { restauranteId: user.userId },
    include: { itens: { include: { produto: true } } },
    orderBy: { criadoEm: "desc" },
    take: 5,
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">{restaurante.nome}</h1>
        <p className="text-zinc-500 mt-1">Visão geral do seu restaurante</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="📝"
          label="Produtos"
          value={produtosCount}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon="📋"
          label="Total Pedidos"
          value={pedidosCount}
          color="text-zinc-600"
          bg="bg-zinc-50"
        />
        <StatCard
          icon="⏳"
          label="Pendentes"
          value={pedidosPendentes}
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <StatCard
          icon="💰"
          label="Faturamento"
          value={formatCents(faturamento._sum.totalCents || 0)}
          color="text-green-600"
          bg="bg-green-50"
        />
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900">Últimos Pedidos</h2>
          <Link href="/restaurante/pedidos" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition">
            Ver todos →
          </Link>
        </div>

        {ultimosPedidos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-zinc-500">Nenhum pedido ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ultimosPedidos.map((pedido) => (
              <Link
                key={pedido.id}
                href={`/restaurante/pedidos/${pedido.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-orange-50 transition-all group"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                    Pedido #{pedido.id}
                  </p>
                  <p className="text-sm text-zinc-500 truncate">
                    {pedido.itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(", ")}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-zinc-900">{formatCents(pedido.totalCents)}</p>
                  <span className="text-xs text-zinc-400">{statusLabels[pedido.status]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} text-lg mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}
