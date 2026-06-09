import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { apiError } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        comprador: true,
        restaurante: true,
        entregador: true,
      },
    });

    if (!user) return apiError("Email ou senha inválidos", 401);

    const valid = await comparePassword(data.password, user.passwordHash);
    if (!valid) return apiError("Email ou senha inválidos", 401);

    let nome = user.email;
    if (user.restaurante) nome = user.restaurante.nome;
    else if (user.entregador) nome = `Entregador ${user.id}`;
    else if (user.comprador) nome = `Cliente ${user.id}`;

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      nome,
    });

    const response = Response.json({
      user: { id: user.id, email: user.email, role: user.role, nome },
    });
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
