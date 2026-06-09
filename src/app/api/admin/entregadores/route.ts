import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return apiError("Não autenticado", 401);

  const user = await verifyToken(token);
  if (!user || user.role !== "ADMIN") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { entregadorId, disponivel } = z
      .object({ entregadorId: z.number(), disponivel: z.boolean() })
      .parse(body);

    await prisma.entregador.update({
      where: { userId: entregadorId },
      data: { disponivel },
    });

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
