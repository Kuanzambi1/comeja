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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
            <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
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
                className="card-premium overflow-hidden animate-fade-in"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-xs font-bold text-zinc-800 shadow-sm">
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {r.horarioInicio || "10:00"} - {r.horarioFim || "23:00"}
                    </span>
                  </div>

                  {precoMin && (
                    <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
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
                      <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="font-semibold text-zinc-600">4.5</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Kz 100,00
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      30-45 min
                    </span>
                  </div>

                  {r.produtos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-100">
                      <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
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
