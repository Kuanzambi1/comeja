import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  const totalRestaurantes = await prisma.restaurante.count();
  const totalEntregadores = await prisma.entregador.count();
  const totalPedidos = await prisma.pedido.count();
  const pedidosHoje = await prisma.pedido.count({
    where: { criadoEm: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
  });
  const totalCancelados = await prisma.pedido.count({ where: { status: "CANCELADO" } });
  const totalEntregues = await prisma.pedido.count({ where: { status: "ENTREGUE" } });
  const pendentes = await prisma.pedido.count({ where: { status: "RECEBIDO" } });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Painel Administrativo</h1>
        <p className="text-zinc-500 mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon="🏪" label="Restaurantes" value={totalRestaurantes} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon="🛵" label="Entregadores" value={totalEntregadores} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon="📋" label="Total Pedidos" value={totalPedidos} color="text-zinc-600" bg="bg-zinc-50" />
        <StatCard icon="📊" label="Hoje" value={pedidosHoje} color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon="✅" label="Entregues" value={totalEntregues} color="text-green-600" bg="bg-green-50" />
        <StatCard icon="⏳" label="Pendentes" value={pendentes} color="text-yellow-600" bg="bg-yellow-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Resumo Rápido</h2>
          <div className="space-y-4">
            <SummaryRow label="Restaurantes ativos" value={totalRestaurantes} color="bg-blue-500" />
            <SummaryRow label="Entregadores cadastrados" value={totalEntregadores} color="bg-purple-500" />
            <SummaryRow label="Pedidos cancelados" value={totalCancelados} color="bg-red-500" />
            <SummaryRow label="Pedidos entregues" value={totalEntregues} color="bg-green-500" />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Status da Plataforma</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse-soft" />
                <span className="font-semibold text-green-700">Sistema operacional</span>
              </div>
              <span className="badge badge-success">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-zinc-400" />
                <span className="font-semibold text-zinc-700">Taxa de entrega padrão</span>
              </div>
              <span className="font-bold text-zinc-900">R$ 5,00</span>
            </div>
          </div>
        </div>
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

function SummaryRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-sm text-zinc-600">{label}</span>
      </div>
      <span className="font-bold text-zinc-900">{value}</span>
    </div>
  );
}
