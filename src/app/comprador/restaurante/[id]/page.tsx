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
      <div className="relative -mx-4 sm:-mx-6 -mt-6 h-52 sm:h-64 overflow-hidden">
        <img
          src={bannerImg}
          alt={restaurante.nome}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-sm">
            {restaurante.nome}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1">★ 4.5</span>
            <span className="flex items-center gap-1">🕐 30-45 min</span>
            <span className="flex items-center gap-1">🚚 R$ 5,00</span>
            {restaurante.horarioInicio && restaurante.horarioFim && (
              <span className="flex items-center gap-1">
                🕐 {restaurante.horarioInicio} - {restaurante.horarioFim}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-8 space-y-4">
        {restaurante.produtos.map((produto, idx) => (
          <div
            key={produto.id}
            className="card p-4 flex items-center gap-4 animate-fade-in group"
            style={{ animationDelay: `${idx * 60}ms` } as React.CSSProperties}
          >
            {/* Thumbnail */}
            <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
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
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-zinc-700">Cardápio vazio</p>
          <p className="text-sm text-zinc-500 mt-1">
            Este restaurante ainda não possui produtos disponíveis
          </p>
        </div>
      )}
    </div>
  );
}
