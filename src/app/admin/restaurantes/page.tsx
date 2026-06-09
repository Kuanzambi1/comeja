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
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-lg font-semibold text-zinc-700">Nenhum restaurante cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurantes.map((r, idx) => (
            <div
              key={r.userId}
              className="card p-5 flex items-center justify-between animate-fade-in"
              style={{ animationDelay: `${idx * 40}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                  r.disponivel ? "bg-green-100" : "bg-red-100"
                }`}>
                  🏪
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
