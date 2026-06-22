import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tipo,
      sessionId,
      pageUrl,
      elementSelector,
      x,
      y,
      viewportW,
      viewportH,
      pageH,
      metadata,
    } = body;

    if (!tipo || !sessionId || !pageUrl) {
      return NextResponse.json({ error: "campos obrigatórios" }, { status: 400 });
    }

    await prisma.eventoRastreamento.create({
      data: {
        tipo,
        sessionId,
        pageUrl,
        elementSelector: elementSelector || null,
        x: x != null ? x : null,
        y: y != null ? y : null,
        viewportW: viewportW != null ? viewportW : null,
        viewportH: viewportH != null ? viewportH : null,
        pageH: pageH != null ? pageH : null,
        metadata: metadata || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro rastreamento:", error);
    return NextResponse.json({ error: "erro interno" }, { status: 500 });
  }
}
