import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";

const schema = z.object({
  pedidoId: z.number(),
  notaRestaurante: z.number().min(1).max(5),
  notaEntregador: z.number().min(1).max(5),
  comentario: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "COMPRADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const pedido = await prisma.pedido.findUnique({
      where: { id: data.pedidoId },
    });

    if (!pedido || pedido.compradorId !== user.userId)
      return apiError("Pedido não encontrado", 404);

    if (pedido.status !== "ENTREGUE")
      return apiError("Só é possível avaliar pedidos entregues", 400);

    const avaliacao = await prisma.avaliacao.create({
      data: {
        compradorId: user.userId,
        pedidoId: data.pedidoId,
        notaRestaurante: data.notaRestaurante,
        notaEntregador: data.notaEntregador,
        comentario: data.comentario,
      },
    });

    return Response.json({ avaliacao }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0].message, 400);
    }
    return apiError("Erro interno", 500);
  }
}
