import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import { getRestaurantImage, getProductImage } from "@/lib/images";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export default async function RestaurantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurante = await prisma.restaurante.findUnique({
    where: { userId: Number(id) },
    include: {
      produtos: { where: { disponivel: true }, orderBy: { precoCents: "asc" } },
    },
  });

  if (!restaurante) notFound();

  const bannerImg = getRestaurantImage(restaurante.nome);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Banner */}
      <div className="relative -mx-4 sm:-mx-6 -mt-6 h-56 sm:h-72 overflow-hidden">
        <img
          src={bannerImg}
          alt={restaurante.nome}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/20">
            <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            4.5
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-sm">
            {restaurante.nome}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Kz 100,00
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              30-45 min
            </span>
            {restaurante.horarioInicio && restaurante.horarioFim && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {restaurante.horarioInicio} - {restaurante.horarioFim}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Cardápio</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          {restaurante.produtos.length} {restaurante.produtos.length === 1 ? "item disponível" : "itens disponíveis"}
        </p>
      </div>

      {/* Menu */}
      <div className="space-y-4">
        {restaurante.produtos.map((produto, idx) => (
          <div
            key={produto.id}
            className="card p-4 flex items-center gap-4 animate-fade-in group hover:-translate-y-0.5 transition-all duration-200"
            style={{ animationDelay: `${idx * 60}ms` } as React.CSSProperties}
          >
            {/* Thumbnail */}
            <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 shadow-sm">
              <img
                src={getProductImage(produto.nome)}
                alt={produto.nome}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                {produto.nome}
              </h3>
              <p className="mt-0.5 text-sm text-zinc-500 line-clamp-1">
                {produto.descricao}
              </p>
              <p className="mt-1.5 text-base font-bold text-orange-600">
                {formatCents(produto.precoCents)}
              </p>
            </div>

            {/* Add button */}
            <AddToCartButton
              produtoId={produto.id}
              nome={produto.nome}
              precoCents={produto.precoCents}
              restauranteId={restaurante.userId}
              restauranteNome={restaurante.nome}
            />
          </div>
        ))}
      </div>

      {restaurante.produtos.length === 0 && (
        <div className="card p-16 text-center mt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
          </div>
          <p className="text-xl font-semibold text-zinc-700">Cardápio vazio</p>
          <p className="text-sm text-zinc-500 mt-1">
            Este restaurante ainda não possui produtos disponíveis
          </p>
        </div>
      )}
    </div>
  );
}
