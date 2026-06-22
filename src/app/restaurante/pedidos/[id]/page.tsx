import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { formatCents } from "@/lib/utils";
import { AutoRefresh } from "@/app/AutoRefresh";
import StatusButton from "./StatusButton";

const statusConfig: Record<string, { label: string; color: string; desc: string }> = {
  RECEBIDO: { label: "Recebido", color: "badge-warning", desc: "Aguardando sua confirmação" },
  EM_PREPARO: { label: "Em preparo", color: "badge-primary", desc: "Preparando o pedido" },
  PRONTO: { label: "Pronto", color: "badge-success", desc: "Aguardando entregador" },
  ACEITO_ENTREGADOR: { label: "Entregador à caminho", color: "badge-primary", desc: "Entregador está indo buscar" },
  A_CAMINHO_RESTAURANTE: { label: "Saiu para entrega", color: "badge-primary", desc: "Pedido saiu para entrega" },
  A_CAMINHO_CLIENTE: { label: "Saiu para entrega", color: "badge-primary", desc: "Pedido a caminho do cliente" },
  ENTREGUE: { label: "Entregue", color: "badge-success", desc: "Pedido entregue com sucesso" },
  CANCELADO: { label: "Cancelado", color: "badge-danger", desc: "Pedido cancelado" },
};

const nextStatus: Record<string, string> = {
  RECEBIDO: "EM_PREPARO",
  EM_PREPARO: "PRONTO",
};

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user || user.role !== "RESTAURANTE") redirect("/auth/login");

  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: {
      comprador: { include: { enderecos: true } },
      itens: { include: { produto: true } },
      entregador: { include: { user: true } },
    },
  });

  if (!pedido || pedido.restauranteId !== user.userId) notFound();

  const status = statusConfig[pedido.status] || { label: pedido.status, color: "badge-primary", desc: "" };
  const canUpdate = !!nextStatus[pedido.status];
  const isCancelledOrDelivered = pedido.status === "CANCELADO" || pedido.status === "ENTREGUE";

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-zinc-900">Pedido #{pedido.id}</h1>
          <span className={`badge ${status.color}`}>{status.label}</span>
        </div>
        <p className="text-sm text-zinc-500">
          {new Date(pedido.criadoEm).toLocaleString("pt")}
        </p>
        <div className="mt-3 rounded-xl bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">{status.desc}</p>
        </div>
      </div>

      {/* Items */}
      <div className="card p-6 mt-4">
        <h2 className="font-bold text-zinc-900 mb-4">Itens</h2>
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
        <div className="mt-4 pt-4 border-t space-y-1">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Taxa de entrega</span>
            <span>{formatCents(pedido.taxaEntregaCents)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-zinc-900 pt-1">
            <span>Total</span>
            <span className="text-orange-600">{formatCents(pedido.totalCents)}</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          Pagamento: {pedido.formaPagamento === "DINHEIRO" ? "💵 Dinheiro" : pedido.formaPagamento === "CARTAO" ? "💳 Cartão" : "📱 PIX"}
        </p>
      </div>

      {/* Actions */}
      {canUpdate && (
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-zinc-900 mb-3">Ações</h2>
          <StatusButton pedidoId={pedido.id} nextStatus={nextStatus[pedido.status]} />
        </div>
      )}

      {/* Delivery Address */}
      {!isCancelledOrDelivered && pedido.comprador.enderecos.length > 0 && (
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-zinc-900 mb-2">Endereço de Entrega</h2>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">📍</span>
            <p className="text-zinc-600">{pedido.comprador.enderecos[0].logradouro}</p>
          </div>
        </div>
      )}

      {/* Delivery Person */}
      {pedido.entregador && (
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-zinc-900 mb-2">Entregador</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg">🛵</div>
            <div>
              <p className="font-medium text-zinc-800">{pedido.entregador.user.email}</p>
              <p className="text-sm text-zinc-500">{pedido.entregador.veiculo}</p>
            </div>
          </div>
        </div>
      )}

      <AutoRefresh intervalMs={8000} status={pedido.status} />
    </div>
  );
}
