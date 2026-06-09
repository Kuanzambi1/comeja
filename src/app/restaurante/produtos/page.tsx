import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import NovoProdutoForm from "./NovoProdutoForm";
import ToggleProdutoButton from "./ToggleProdutoButton";

export default async function ProdutosPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "RESTAURANTE") redirect("/auth/login");

  const produtos = await prisma.produto.findMany({
    where: { restauranteId: user.userId },
    orderBy: [{ disponivel: "desc" }, { nome: "asc" }],
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Cardápio</h1>
        <p className="text-zinc-500 mt-1">Gerencie seus produtos e preços</p>
      </div>

      {/* Add Product Form */}
      <div className="card p-6 mb-8">
        <h2 className="font-bold text-zinc-900 mb-1">Adicionar Produto</h2>
        <p className="text-sm text-zinc-500 mb-4">Cadastre um novo item no cardápio</p>
        <NovoProdutoForm />
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {produtos.map((produto, idx) => (
          <div
            key={produto.id}
            className="card p-5 flex items-center justify-between animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` } as React.CSSProperties}
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                produto.disponivel ? "bg-orange-100" : "bg-zinc-100"
              }`}>
                {produto.disponivel ? "🍔" : "🔒"}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-zinc-900">{produto.nome}</h3>
                <p className="text-sm text-zinc-500 line-clamp-1">{produto.descricao}</p>
                <p className="mt-1 text-base font-bold text-orange-600">
                  {formatCents(produto.precoCents)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`badge ${
                produto.disponivel ? "badge-success" : "badge-danger"
              }`}>
                {produto.disponivel ? "Disponível" : "Indisponível"}
              </span>
              <ToggleProdutoButton
                produtoId={produto.id}
                disponivel={produto.disponivel}
              />
            </div>
          </div>
        ))}

        {produtos.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-semibold text-zinc-700">Nenhum produto cadastrado</p>
            <p className="text-sm text-zinc-500 mt-1">Adicione seu primeiro produto acima</p>
          </div>
        )}
      </div>
    </div>
  );
}
