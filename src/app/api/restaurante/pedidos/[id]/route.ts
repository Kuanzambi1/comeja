import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";
import type { PedidoStatus } from "@/generated/prisma/enums";

const allowedTransitions: Record<string, string[]> = {
  RECEBIDO: ["EM_PREPARO"],
  EM_PREPARO: ["PRONTO"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "RESTAURANTE") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { status } = z.object({ status: z.string() }).parse(body);

    const entry = Object.entries(allowedTransitions).find(([, to]) =>
      to.includes(status)
    );
    if (!entry) return apiError("Transição de status não permitida", 400);

    const result = await prisma.pedido.updateMany({
      where: {
        id: Number(id),
        restauranteId: user.userId,
        status: entry[0] as PedidoStatus,
      },
      data: { status: status as PedidoStatus },
    });

    if (result.count === 0) return apiError("Pedido não encontrado", 404);

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
