import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "COMPRADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { status } = z.object({ status: z.string() }).parse(body);

    if (status !== "CANCELADO") return apiError("Ação inválida", 400);

    const result = await prisma.pedido.updateMany({
      where: { id: Number(id), compradorId: user.userId, status: "RECEBIDO" },
      data: { status: "CANCELADO" },
    });

    if (result.count === 0) return apiError("Não foi possível cancelar o pedido", 400);

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
