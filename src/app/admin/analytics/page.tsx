import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import HeatmapClient from "./HeatmapClient";

export default async function AdminAnalyticsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  const [totalVisitas, totalCliques, totalConversoes, topPaginas, cliquesPorPagina, ultimosEventos] =
    await Promise.all([
      prisma.eventoRastreamento.count({ where: { tipo: "visita" } }),
      prisma.eventoRastreamento.count({ where: { tipo: "clique" } }),
      prisma.eventoRastreamento.count({ where: { tipo: "conversao" } }),
      prisma.eventoRastreamento.groupBy({
        by: ["pageUrl"],
        where: { tipo: "visita" },
        _count: { pageUrl: true },
        orderBy: { _count: { pageUrl: "desc" } },
        take: 10,
      }),
      prisma.eventoRastreamento.groupBy({
        by: ["pageUrl"],
        where: { tipo: "clique" },
        _count: { pageUrl: true },
      }),
      prisma.eventoRastreamento.findMany({
        orderBy: { criadoEm: "desc" },
        take: 20,
      }),
    ]);

  const cliqueMap = new Map(cliquesPorPagina.map((c) => [c.pageUrl, c._count.pageUrl]));

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-zinc-500 mt-1">Comportamento do utilizador e heatmap</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👁️" label="Visitas" value={totalVisitas} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon="🖱️" label="Cliques" value={totalCliques} color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon="🛒" label="Conversões" value={totalConversoes} color="text-green-600" bg="bg-green-50" />
        <StatCard
          icon="📊"
          label="Taxa Conversão"
          value={totalVisitas > 0 ? `${((totalConversoes / totalVisitas) * 100).toFixed(1)}%` : "0%"}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* Top Pages */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">Páginas Mais Visitadas</h2>
        {topPaginas.length === 0 ? (
          <p className="text-zinc-500 text-sm">Nenhum dado ainda</p>
        ) : (
          <div className="space-y-2">
            {topPaginas.map((p) => {
              const cliques = cliqueMap.get(p.pageUrl) || 0;
              return (
                <div key={p.pageUrl} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <span className="text-sm font-medium text-zinc-700">{p.pageUrl}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-400">{p._count.pageUrl} visitas</span>
                    <span className="font-bold text-zinc-900">{cliques} cliques</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Heatmap */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">Heatmap de Cliques</h2>
        <HeatmapClient />
      </div>

      {/* Recent Events */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">Eventos Recentes</h2>
        {ultimosEventos.length === 0 ? (
          <p className="text-zinc-500 text-sm">Nenhum evento registado ainda</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 font-semibold text-zinc-600">Tipo</th>
                  <th className="text-left py-2 font-semibold text-zinc-600">Página</th>
                  <th className="text-left py-2 font-semibold text-zinc-600">Elemento</th>
                  <th className="text-left py-2 font-semibold text-zinc-600">Data</th>
                </tr>
              </thead>
              <tbody>
                {ultimosEventos.map((e) => (
                  <tr key={e.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-2">
                      <span className="badge badge-primary text-xs">{e.tipo}</span>
                    </td>
                    <td className="py-2 text-zinc-600 max-w-[200px] truncate">{e.pageUrl}</td>
                    <td className="py-2 text-zinc-500 max-w-[200px] truncate">{e.elementSelector || "—"}</td>
                    <td className="py-2 text-zinc-400 whitespace-nowrap">
                      {new Date(e.criadoEm).toLocaleString("pt")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, color, bg,
}: {
  icon: string; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <div className="card p-5">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} text-lg mb-3`}>{icon}</div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}
