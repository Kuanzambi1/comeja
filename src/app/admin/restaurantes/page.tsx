import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ToggleRestauranteButton from "./ToggleRestauranteButton";

export default async function AdminRestaurantesPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  const restaurantes = await prisma.restaurante.findMany({
    include: { user: true, pedidos: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Restaurantes</h1>
        <p className="text-zinc-500 mt-1">Gerencie os restaurantes da plataforma</p>
      </div>

      {restaurantes.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
          </div>
          <p className="text-lg font-semibold text-zinc-700">Nenhum restaurante cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurantes.map((r, idx) => (
            <div
              key={r.userId}
              className="card p-5 flex items-center justify-between animate-fade-in hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${idx * 40}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  r.disponivel ? "bg-green-100" : "bg-red-100"
                }`}>
                  <svg className={`h-6 w-6 ${r.disponivel ? "text-green-600" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900">{r.nome}</p>
                  <p className="text-sm text-zinc-500">{r.user.email}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {r.pedidos.length} pedidos • {r.horarioInicio || "?"} - {r.horarioFim || "?"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`badge ${r.disponivel ? "badge-success" : "badge-danger"}`}>
                  {r.disponivel ? "Ativo" : "Suspenso"}
                </span>
                <ToggleRestauranteButton
                  restauranteId={r.userId}
                  disponivel={r.disponivel}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
