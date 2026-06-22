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
        <StatCard
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>}
          label="Restaurantes"
          value={totalRestaurantes}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
          label="Entregadores"
          value={totalEntregadores}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
          label="Total Pedidos"
          value={totalPedidos}
          color="text-zinc-600"
          bg="bg-zinc-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
          label="Hoje"
          value={pedidosHoje}
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Entregues"
          value={totalEntregues}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Pendentes"
          value={pendentes}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card-premium p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Resumo Rápido</h2>
          <div className="space-y-4">
            <SummaryRow label="Restaurantes ativos" value={totalRestaurantes} color="bg-blue-500" />
            <SummaryRow label="Entregadores cadastrados" value={totalEntregadores} color="bg-purple-500" />
            <SummaryRow label="Pedidos cancelados" value={totalCancelados} color="bg-red-500" />
            <SummaryRow label="Pedidos entregues" value={totalEntregues} color="bg-green-500" />
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Status da Plataforma</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <span className="font-semibold text-green-700">Sistema operacional</span>
              </div>
              <span className="badge badge-success">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-zinc-400" />
                <span className="font-semibold text-zinc-700">Taxa de entrega padrão</span>
              </div>
              <span className="font-bold text-zinc-900">Kz 100,00</span>
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
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color} mb-3`}>
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
