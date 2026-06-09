import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;
  if (!token) return apiError("Não autenticado", 401);

  const user = await verifyToken(token);
  if (!user || user.role !== "COMPRADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { status } = z.object({ status: z.string() }).parse(body);

    if (status !== "CANCELADO") return apiError("Ação inválida", 400);

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
    });

    if (!pedido || pedido.compradorId !== user.userId)
      return apiError("Pedido não encontrado", 404);

    if (pedido.status !== "RECEBIDO")
      return apiError("Só é possível cancelar pedidos com status 'Recebido'", 400);

    await prisma.pedido.update({
      where: { id: Number(id) },
      data: { status: "CANCELADO" },
    });

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
