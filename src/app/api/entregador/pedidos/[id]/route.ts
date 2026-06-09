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
  if (!user || user.role !== "ENTREGADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { action, status } = z
      .object({ action: z.string(), status: z.string().optional() })
      .parse(body);

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
    });

    if (!pedido) return apiError("Pedido não encontrado", 404);

    if (action === "aceitar") {
      if (pedido.entregadorId) return apiError("Pedido já aceito por outro entregador", 400);
      if (pedido.status !== "PRONTO") return apiError("Pedido não está pronto", 400);

      await prisma.pedido.update({
        where: { id: Number(id) },
        data: { entregadorId: user.userId, status: "ACEITO_ENTREGADOR" },
      });
    } else if (action === "status") {
      if (pedido.entregadorId !== user.userId)
        return apiError("Este pedido não é sua entrega", 403);

      const allowedTransitions: Record<string, string[]> = {
        ACEITO_ENTREGADOR: ["A_CAMINHO_RESTAURANTE"],
        A_CAMINHO_RESTAURANTE: ["A_CAMINHO_CLIENTE"],
        A_CAMINHO_CLIENTE: ["ENTREGUE"],
      };

      const currentStatus = pedido.status;
      const allowed = allowedTransitions[currentStatus];
      if (!allowed || !allowed.includes(status as string))
        return apiError("Transição de status não permitida", 400);

      await prisma.pedido.update({
        where: { id: Number(id) },
        data: { status: status as any },
      });
    } else {
      return apiError("Ação inválida", 400);
    }

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
