"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { emit } from "@/lib/realtime";
import type { PedidoStatus } from "@/generated/prisma/enums";

export async function toggleDisponivel(disponivel: boolean) {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") throw new Error("Acesso negado");

  await prisma.entregador.update({
    where: { userId: user.userId },
    data: { disponivel },
  });

  revalidatePath("/entregador", "layout");
  emit({ tipo: "disponivel_alterado", payload: { entregadorId: user.userId, disponivel } });
}

export async function aceitarPedido(pedidoId: number) {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") throw new Error("Acesso negado");

  const result = await prisma.pedido.updateMany({
    where: { id: pedidoId, entregadorId: null, status: "PRONTO" as PedidoStatus },
    data: { entregadorId: user.userId, status: "ACEITO_ENTREGADOR" as PedidoStatus },
  });

  if (result.count === 0) throw new Error("Pedido não disponível");

  revalidatePath("/entregador", "layout");
  emit({ tipo: "pedido_atualizado", payload: { pedidoId } });
}

const allowedTransitions: Record<string, string[]> = {
  ACEITO_ENTREGADOR: ["A_CAMINHO_RESTAURANTE"],
  A_CAMINHO_RESTAURANTE: ["A_CAMINHO_CLIENTE"],
  A_CAMINHO_CLIENTE: ["ENTREGUE"],
};

export async function atualizarStatusEntrega(pedidoId: number, novoStatus: string) {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") throw new Error("Acesso negado");

  const entry = Object.entries(allowedTransitions).find(([, to]) =>
    to.includes(novoStatus)
  );
  if (!entry) throw new Error("Transição de status não permitida");

  const result = await prisma.pedido.updateMany({
    where: { id: pedidoId, entregadorId: user.userId, status: entry[0] as PedidoStatus },
    data: { status: novoStatus as PedidoStatus },
  });

  if (result.count === 0) throw new Error("Transição de status não permitida");

  revalidatePath("/entregador", "layout");
  emit({ tipo: "pedido_atualizado", payload: { pedidoId } });
}
