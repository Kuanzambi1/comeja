import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { apiError } from "@/lib/utils";

const allowedTransitions: Record<string, string[]> = {
  RECEBIDO: ["EM_PREPARO"],
  EM_PREPARO: ["PRONTO"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;
  if (!token) return apiError("Não autenticado", 401);

  const user = await verifyToken(token);
  if (!user || user.role !== "RESTAURANTE") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { status } = z.object({ status: z.string() }).parse(body);

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
    });

    if (!pedido || pedido.restauranteId !== user.userId)
      return apiError("Pedido não encontrado", 404);

    const allowed = allowedTransitions[pedido.status];
    if (!allowed || !allowed.includes(status))
      return apiError("Transição de status não permitida", 400);

    await prisma.pedido.update({
      where: { id: Number(id) },
      data: { status: status as any },
    });

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
