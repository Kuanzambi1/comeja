import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";

const schema = z.object({
  restauranteId: z.number(),
  itens: z.array(
    z.object({
      produtoId: z.number(),
      quantidade: z.number().min(1),
      precoUnitarioCents: z.number(),
    })
  ),
  taxaEntregaCents: z.number(),
  totalCents: z.number(),
  formaPagamento: z.enum(["DINHEIRO", "CARTAO", "PIX"]),
});

export async function POST(request: NextRequest) {
  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "COMPRADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const pedido = await prisma.pedido.create({
      data: {
        compradorId: user.userId,
        restauranteId: data.restauranteId,
        totalCents: data.totalCents,
        taxaEntregaCents: data.taxaEntregaCents,
        formaPagamento: data.formaPagamento,
        itens: {
          create: data.itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitarioCents: item.precoUnitarioCents,
          })),
        },
      },
    });

    return Response.json({ pedido }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0].message, 400);
    }
    return apiError("Erro interno do servidor", 500);
  }
}
