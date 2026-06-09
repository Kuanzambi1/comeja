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
          <div className="text-5xl mb-4">🛵</div>
          <p className="text-lg font-semibold text-zinc-700">Nenhum entregador cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entregadores.map((e, idx) => (
            <div
              key={e.userId}
              className="card p-5 flex items-center justify-between animate-fade-in"
              style={{ animationDelay: `${idx * 40}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl">
                  🛵
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
