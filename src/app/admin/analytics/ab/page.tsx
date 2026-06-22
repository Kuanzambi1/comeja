import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ABTestPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  const testes = await prisma.testeAB.findMany({
    include: {
      variantes: {
        include: {
          _count: { select: { participacoes: true } },
          participacoes: { where: { convertido: true }, select: { id: true } },
        },
      },
      _count: { select: { participacoes: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Testes A/B</h1>
        <p className="text-zinc-500 mt-1">Resultados e análise comparativa</p>
      </div>

      {testes.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🧪</div>
          <p className="text-lg font-semibold text-zinc-700">Nenhum teste A/B criado</p>
          <p className="text-sm text-zinc-500 mt-1">Os resultados aparecerão aqui depois de criar um teste</p>
        </div>
      ) : (
        <div className="space-y-6">
          {testes.map((teste) => {
            const totalParticipacoes = teste._count.participacoes;
            return (
              <div key={teste.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">{teste.nome}</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      Página: <span className="font-medium text-zinc-700">{teste.pagina}</span>
                    </p>
                  </div>
                  <span className={`badge ${teste.ativo ? "badge-success" : "badge-danger"}`}>
                    {teste.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4 mb-4">
                  <p className="text-sm font-medium text-zinc-700">Hipótese</p>
                  <p className="text-sm text-zinc-600 mt-1">{teste.hipotese}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="text-left py-2 font-semibold text-zinc-600">Variante</th>
                        <th className="text-right py-2 font-semibold text-zinc-600">Peso</th>
                        <th className="text-right py-2 font-semibold text-zinc-600">Participações</th>
                        <th className="text-right py-2 font-semibold text-zinc-600">Conversões</th>
                        <th className="text-right py-2 font-semibold text-zinc-600">Taxa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teste.variantes.map((v) => {
                        const conversoes = v.participacoes.length;
                        const participacoes = v._count.participacoes;
                        const taxa = participacoes > 0 ? ((conversoes / participacoes) * 100).toFixed(1) : "0.0";
                        return (
                          <tr key={v.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                            <td className="py-2 font-medium text-zinc-800">{v.nome}</td>
                            <td className="py-2 text-right text-zinc-600">{v.peso}%</td>
                            <td className="py-2 text-right text-zinc-600">{participacoes}</td>
                            <td className="py-2 text-right text-green-600 font-semibold">{conversoes}</td>
                            <td className="py-2 text-right font-bold text-zinc-900">{taxa}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <p className="text-xs text-zinc-400">
                    Total de participantes: {totalParticipacoes} | Criado em: {new Date(teste.criadoEm).toLocaleString("pt")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
