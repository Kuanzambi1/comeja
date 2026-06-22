import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import { AutoRefresh } from "@/app/AutoRefresh";
import CancelButton from "./CancelButton";
import AvaliacaoForm from "./AvaliacaoForm";

const statusSteps = [
  { key: "RECEBIDO", label: "Pedido Recebido", icon: "📥" },
  { key: "EM_PREPARO", label: "Preparando", icon: "👨‍🍳" },
  { key: "PRONTO", label: "Pronto", icon: "✅" },
  { key: "ACEITO_ENTREGADOR", label: "Entregador a caminho", icon: "🛵" },
  { key: "A_CAMINHO_CLIENTE", label: "Saiu para entrega", icon: "🚚" },
  { key: "ENTREGUE", label: "Entregue", icon: "🎉" },
];

const statusOrder = statusSteps.map((s) => s.key);
const currentStatusIndex = (status: string) => {
  const idx = statusOrder.indexOf(status);
  return idx >= 0 ? idx : -1;
};

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) redirect("/auth/login");

  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: {
      restaurante: true,
      entregador: { include: { user: true } },
      itens: { include: { produto: true } },
      avaliacao: true,
    },
  });

  if (!pedido || pedido.compradorId !== user.userId) notFound();

  const canCancel = pedido.status === "RECEBIDO";
  const canReview = pedido.status === "ENTREGUE" && !pedido.avaliacao;
  const isCancelled = pedido.status === "CANCELADO";
  const currentIdx = currentStatusIndex(pedido.status);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-zinc-900">Pedido #{pedido.id}</h1>
          {isCancelled ? (
            <span className="badge badge-danger">Cancelado</span>
          ) : (
            <span className="badge badge-success">Ativo</span>
          )}
        </div>
        <p className="text-sm text-zinc-500">
          {pedido.restaurante.nome} • {new Date(pedido.criadoEm).toLocaleDateString("pt", {
            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </p>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-zinc-900 mb-6">Acompanhamento</h2>
          <div className="relative">
            {statusSteps.map((step, idx) => {
              const isActive = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={step.key} className="flex items-start gap-4 pb-8 last:pb-0 relative">
                  {/* Connector line */}
                  {idx < statusSteps.length - 1 && (
                    <div className={`absolute left-[19px] top-10 w-0.5 h-10 ${
                      idx < currentIdx ? "bg-orange-500" : "bg-zinc-200"
                    }`} />
                  )}
                  {/* Circle */}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-all ${
                    isActive ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-zinc-100 text-zinc-400"
                  } ${isCurrent ? "ring-4 ring-orange-100" : ""}`}>
                    {step.icon}
                  </div>
                  {/* Content */}
                  <div className="pt-1.5">
                    <p className={`font-semibold ${
                      isActive ? "text-zinc-900" : "text-zinc-400"
                    }`}>{step.label}</p>
                    {isCurrent && (
                      <p className="text-sm text-orange-600 font-medium mt-0.5 animate-pulse-soft">
                        {pedido.status === "RECEBIDO" && "Aguardando confirmação do restaurante"}
                        {pedido.status === "EM_PREPARO" && "Seu pedido está sendo preparado"}
                        {pedido.status === "PRONTO" && "Aguardando entregador"}
                        {pedido.status === "ACEITO_ENTREGADOR" && "Entregador está indo ao restaurante"}
                        {pedido.status === "A_CAMINHO_RESTAURANTE" && "Entregador está indo ao restaurante"}
                        {pedido.status === "A_CAMINHO_CLIENTE" && "Seu pedido está a caminho!"}
                        {pedido.status === "ENTREGUE" && "Pedido entregue! Bom apetite!"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="card p-6 mt-4">
        <h2 className="font-bold text-zinc-900 mb-4">Itens do Pedido</h2>
        <div className="space-y-3">
          {pedido.itens.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-600">
                  {item.quantidade}
                </span>
                <span className="font-medium text-zinc-800">{item.produto.nome}</span>
              </div>
              <span className="font-semibold text-zinc-900">
                {formatCents(item.precoUnitarioCents * item.quantidade)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t space-y-1.5">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Taxa de entrega</span>
            <span>{formatCents(pedido.taxaEntregaCents)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-zinc-900">
            <span>Total</span>
            <span className="text-orange-600">{formatCents(pedido.totalCents)}</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="card p-6 mt-4">
        <h2 className="font-bold text-zinc-900 mb-2">Pagamento</h2>
        <div className="flex items-center gap-2 text-zinc-600">
          <span className="text-lg">
            {pedido.formaPagamento === "DINHEIRO" ? "💵" : pedido.formaPagamento === "CARTAO" ? "💳" : "📱"}
          </span>
          <span className="font-medium">
            {pedido.formaPagamento === "DINHEIRO" ? "Dinheiro" : pedido.formaPagamento === "CARTAO" ? "Cartão" : "PIX"}
          </span>
        </div>
      </div>

      {/* Delivery Person */}
      {pedido.entregador && (
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-zinc-900 mb-2">Entregador</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg">
              🛵
            </div>
            <div>
              <p className="font-medium text-zinc-800">{pedido.entregador.user.email}</p>
              <p className="text-sm text-zinc-500">{pedido.entregador.veiculo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      {canCancel && <CancelButton pedidoId={pedido.id} />}

      {/* Review */}
      {canReview && <AvaliacaoForm pedidoId={pedido.id} />}

      {pedido.avaliacao && (
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-zinc-900 mb-3">Sua Avaliação</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm text-zinc-500">Restaurante:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${
                    star <= (pedido.avaliacao?.notaRestaurante || 0) ? "text-yellow-400" : "text-zinc-200"
                  }`}>★</span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-zinc-500">Entregador:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${
                    star <= (pedido.avaliacao?.notaEntregador || 0) ? "text-yellow-400" : "text-zinc-200"
                  }`}>★</span>
                ))}
              </div>
            </div>
            {pedido.avaliacao?.comentario && (
              <p className="text-sm text-zinc-600 italic bg-zinc-50 rounded-xl p-3">
                &ldquo;{pedido.avaliacao.comentario}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      <AutoRefresh intervalMs={8000} status={pedido.status} />
    </div>
  );
}
