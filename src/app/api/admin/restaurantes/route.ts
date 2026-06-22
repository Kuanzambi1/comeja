import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "ADMIN") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { restauranteId, disponivel } = z
      .object({ restauranteId: z.number(), disponivel: z.boolean() })
      .parse(body);

    await prisma.restaurante.update({
      where: { userId: restauranteId },
      data: { disponivel },
    });

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
