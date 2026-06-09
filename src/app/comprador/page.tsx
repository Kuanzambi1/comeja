import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCents } from "@/lib/utils";
import { getRestaurantImage } from "@/lib/images";

export default async function CompradorHome() {
  const restaurantes = await prisma.restaurante.findMany({
    where: { disponivel: true },
    include: { produtos: { where: { disponivel: true }, take: 1 } },
  });

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Restaurantes</h1>
        <p className="mt-1 text-zinc-500">Escolha um restaurante para ver o cardápio</p>
      </div>

      {restaurantes.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl font-semibold text-zinc-700">Nenhum restaurante disponível</p>
          <p className="text-sm text-zinc-500 mt-1">Tente novamente mais tarde</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurantes.map((r, idx) => {
            const imgSrc = getRestaurantImage(r.nome);
            const precoMin = r.produtos.length > 0
              ? Math.min(...r.produtos.map(p => p.precoCents))
              : null;

            return (
              <Link
                key={r.userId}
                href={`/comprador/restaurante/${r.userId}`}
                className="card overflow-hidden group hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${idx * 80}ms` } as React.CSSProperties}
              >
                {/* Image */}
                <div className="relative h-44 bg-zinc-100 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={r.nome}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Delivery time badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-zinc-800 shadow-sm">
                    🕐 {r.horarioInicio || "10:00"} - {r.horarioFim || "23:00"}
                  </div>

                  {/* Price badge */}
                  {precoMin && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
                      A partir de {formatCents(precoMin)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {r.nome}
                    </h2>
                    <div className="flex items-center gap-1 text-sm shrink-0 ml-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-zinc-600">4.5</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">🚚 R$ 5,00</span>
                    <span className="flex items-center gap-1">🕐 30-45 min</span>
                  </div>

                  {r.produtos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-100">
                      <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        Mais pedido
                      </p>
                      <p className="mt-1 text-sm font-medium text-zinc-700">
                        {r.produtos[0].nome}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
