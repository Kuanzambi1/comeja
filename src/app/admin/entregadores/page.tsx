import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ToggleEntregadorButton from "./ToggleEntregadorButton";

export default async function AdminEntregadoresPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  const entregadores = await prisma.entregador.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Entregadores</h1>
        <p className="text-zinc-500 mt-1">Gerencie os entregadores da plataforma</p>
      </div>

      {entregadores.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
          </div>
          <p className="text-lg font-semibold text-zinc-700">Nenhum entregador cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entregadores.map((e, idx) => (
            <div
              key={e.userId}
              className="card p-5 flex items-center justify-between animate-fade-in hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${idx * 40}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900">{e.user.email}</p>
                  <p className="text-sm text-zinc-500">{e.veiculo}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Doc: {e.documento}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`badge ${e.disponivel ? "badge-success" : "badge-danger"}`}>
                  {e.disponivel ? "Disponível" : "Indisponível"}
                </span>
                <ToggleEntregadorButton entregadorId={e.userId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
