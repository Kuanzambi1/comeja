import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/utils";

export async function GET() {
  try {
    const restaurantes = await prisma.restaurante.findMany({
      where: { disponivel: true },
      include: {
        produtos: { where: { disponivel: true } },
      },
    });
    return Response.json({ restaurantes });
  } catch {
    return apiError("Erro interno", 500);
  }
}
