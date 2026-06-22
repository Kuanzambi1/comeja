import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  const user = getAuthUserFromHeaders(request.headers);
  if (!user || user.role !== "ENTREGADOR") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const { disponivel } = z.object({ disponivel: z.boolean() }).parse(body);

    await prisma.entregador.update({
      where: { userId: user.userId },
      data: { disponivel },
    });

    return Response.json({ success: true });
  } catch {
    return apiError("Erro interno", 500);
  }
}
