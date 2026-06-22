"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { emit } from "@/lib/realtime";
import type { PedidoStatus } from "@/generated/prisma/enums";

const allowedTransitions: Record<string, string[]> = {
  RECEBIDO: ["EM_PREPARO"],
  EM_PREPARO: ["PRONTO"],
};

export async function atualizarStatusPedido(pedidoId: number, status: string) {
  const user = await getAuthUser();
  if (!user || user.role !== "RESTAURANTE") throw new Error("Acesso negado");

  const entry = Object.entries(allowedTransitions).find(([, to]) =>
    to.includes(status)
  );
  if (!entry) throw new Error("Transição de status não permitida");

  const result = await prisma.pedido.updateMany({
    where: { id: pedidoId, restauranteId: user.userId, status: entry[0] as PedidoStatus },
    data: { status: status as PedidoStatus },
  });

  if (result.count === 0) throw new Error("Pedido não encontrado");

  revalidatePath("/restaurante", "layout");
  emit({ tipo: "pedido_atualizado", payload: { pedidoId } });
}
