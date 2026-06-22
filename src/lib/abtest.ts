import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type VarianteInfo = {
  id: number;
  nome: string;
  config: Record<string, unknown>;
};

function getSessionId(): string {
  return crypto.randomUUID();
}

export async function getVarianteAtiva(
  testIdOrNome: number | string
): Promise<VarianteInfo | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("ab_session")?.value;

  const teste = await prisma.testeAB.findFirst({
    where:
      typeof testIdOrNome === "number"
        ? { id: testIdOrNome, ativo: true }
        : { nome: testIdOrNome, ativo: true },
    include: { variantes: true },
  });
  if (!teste || teste.variantes.length === 0) return null;

  if (sessionId) {
    const participacao = await prisma.participacaoTeste.findUnique({
      where: { testeId_sessionId: { testeId: teste.id, sessionId } },
    });

    if (participacao) {
      const variante = teste.variantes.find(
        (v) => v.id === participacao.varianteId
      );
      if (variante)
        return {
          id: variante.id,
          nome: variante.nome,
          config: JSON.parse(variante.configuracoes || "{}"),
        };
      return null;
    }
  }

  const totalPeso = teste.variantes.reduce((s, v) => s + v.peso, 0);
  let rand = Math.random() * totalPeso;
  let chosen = teste.variantes[0];
  for (const v of teste.variantes) {
    rand -= v.peso;
    if (rand <= 0) {
      chosen = v;
      break;
    }
  }

  if (sessionId) {
    await prisma.participacaoTeste.create({
      data: { testeId: teste.id, varianteId: chosen.id, sessionId },
    });
  }

  return {
    id: chosen.id,
    nome: chosen.nome,
    config: JSON.parse(chosen.configuracoes || "{}"),
  };
}

export async function registrarConversaoAB(
  testIdOrNome: number | string
): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("ab_session")?.value;
  if (!sessionId) return;

  const teste = await prisma.testeAB.findFirst({
    where:
      typeof testIdOrNome === "number"
        ? { id: testIdOrNome }
        : { nome: testIdOrNome },
  });
  if (!teste) return;

  await prisma.participacaoTeste.updateMany({
    where: { testeId: teste.id, sessionId, convertido: false },
    data: { convertido: true },
  });
}

export async function criarSessaoAB(): Promise<string> {
  const sessionId = getSessionId();
  const cookieStore = await cookies();
  cookieStore.set("ab_session", sessionId, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: false,
  });
  return sessionId;
}
