import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";
import type { PedidoStatus } from "@/generated/prisma/enums";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "ENTREGADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { action, status } = z
      .object({ action: z.string(), status: z.string().optional() })
      .parse(body);

    const pedidoId = Number(id);

    if (action === "aceitar") {
      const result = await prisma.pedido.updateMany({
        where: { id: pedidoId, entregadorId: null, status: "PRONTO" },
        data: { entregadorId: user.userId, status: "ACEITO_ENTREGADOR" },
      });
      if (result.count === 0) return apiError("Pedido não disponível", 400);
    } else if (action === "status") {
      const allowedTransitions: Record<string, string[]> = {
        ACEITO_ENTREGADOR: ["A_CAMINHO_RESTAURANTE"],
        A_CAMINHO_RESTAURANTE: ["A_CAMINHO_CLIENTE"],
        A_CAMINHO_CLIENTE: ["ENTREGUE"],
      };

      const entry = Object.entries(allowedTransitions).find(([, to]) =>
        to.includes(status!)
      );
      if (!entry) return apiError("Transição de status não permitida", 400);

      const result = await prisma.pedido.updateMany({
        where: {
          id: pedidoId,
          entregadorId: user.userId,
          status: entry[0] as PedidoStatus,
        },
        data: { status: status as PedidoStatus },
      });
      if (result.count === 0) return apiError("Transição de status não permitida", 400);
    } else {
      return apiError("Ação inválida", 400);
    }

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
