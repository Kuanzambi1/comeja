import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { apiError } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["COMPRADOR", "RESTAURANTE", "ENTREGADOR"]),
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").optional(),
  documento: z.string().optional(),
  veiculo: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return apiError("Email já cadastrado", 409);

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        telefone: data.telefone,
        passwordHash,
        role: data.role,
        ...(data.role === "RESTAURANTE" && data.nome
          ? { restaurante: { create: { nome: data.nome } } }
          : {}),
        ...(data.role === "ENTREGADOR" && data.documento && data.veiculo
          ? { entregador: { create: { documento: data.documento, veiculo: data.veiculo } } }
          : {}),
        ...(data.role === "COMPRADOR"
          ? { comprador: { create: {} } }
          : {}),
      },
      include: {
        comprador: true,
        restaurante: true,
        entregador: true,
      },
    });

    const nome = data.nome || user.email;
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      nome,
    });

    const response = Response.json(
      { user: { id: user.id, email: user.email, role: user.role, nome } },
      { status: 201 }
    );
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0].message, 400);
    }
    return apiError("Erro interno do servidor", 500);
  }
}
