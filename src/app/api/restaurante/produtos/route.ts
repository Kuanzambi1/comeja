import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { apiError } from "@/lib/utils";

const createSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  precoCents: z.number().min(1, "Preço deve ser maior que zero"),
});

const updateSchema = z.object({
  produtoId: z.number(),
  disponivel: z.boolean(),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return apiError("Não autenticado", 401);

  const user = await verifyToken(token);
  if (!user || user.role !== "RESTAURANTE") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const produto = await prisma.produto.create({
      data: {
        restauranteId: user.userId,
        nome: data.nome,
        descricao: data.descricao || "",
        precoCents: data.precoCents,
      },
    });

    return Response.json({ produto }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return apiError(error.issues[0].message, 400);
    return apiError("Erro interno", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return apiError("Não autenticado", 401);

  const user = await verifyToken(token);
  if (!user || user.role !== "RESTAURANTE") return apiError("Acesso negado", 403);

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    const produto = await prisma.produto.findUnique({
      where: { id: data.produtoId },
    });

    if (!produto || produto.restauranteId !== user.userId)
      return apiError("Produto não encontrado", 404);

    await prisma.produto.update({
      where: { id: data.produtoId },
      data: { disponivel: data.disponivel },
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) return apiError(error.issues[0].message, 400);
    return apiError("Erro interno", 500);
  }
}
