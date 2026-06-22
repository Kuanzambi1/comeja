import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromHeaders } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthUserFromHeaders(req.headers);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const filtroPagina = searchParams.get("pageUrl");

  const paginasRaw = await prisma.eventoRastreamento.groupBy({
    by: ["pageUrl"],
    where: { tipo: "clique" },
    _count: { pageUrl: true },
    _max: { criadoEm: true },
    orderBy: { _count: { pageUrl: "desc" } },
  });

  const paginas = paginasRaw.map((p) => ({
    pageUrl: p.pageUrl,
    total: p._count.pageUrl,
    ultimo: p._max.criadoEm,
  }));

  const where: Record<string, unknown> = {
    tipo: "clique",
    x: { not: null },
    y: { not: null },
    viewportW: { not: null },
    pageH: { not: null },
  };
  if (filtroPagina) where.pageUrl = filtroPagina;

  const cliques = await prisma.eventoRastreamento.findMany({
    where: where as any,
    select: {
      x: true,
      y: true,
      viewportW: true,
      viewportH: true,
      pageH: true,
      pageUrl: true,
      elementSelector: true,
    },
  });

  const grid = new Map<
    string,
    {
      x: number;
      y: number;
      count: number;
      pageUrl: string;
      elementos: Map<string, number>;
    }
  >();

  for (const c of cliques) {
    if (
      c.x == null ||
      c.y == null ||
      c.viewportW == null ||
      c.pageH == null
    )
      continue;
    const px = Math.round((c.x / (c.viewportW || 1)) * 50);
    const py = Math.round((c.y / (c.pageH || 1)) * 50);
    const key = `${px}_${py}`;
    let grupo = grid.get(key);
    if (!grupo) {
      grupo = {
        x: px * 2,
        y: py * 2,
        count: 0,
        pageUrl: c.pageUrl,
        elementos: new Map(),
      };
      grid.set(key, grupo);
    }
    grupo.count++;
    if (c.elementSelector) {
      const selCount = grupo.elementos.get(c.elementSelector) || 0;
      grupo.elementos.set(c.elementSelector, selCount + 1);
    }
  }

  const pontos = Array.from(grid.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 200)
    .map((g) => {
      let topSelector = "";
      let topCount = 0;
      for (const [sel, cnt] of g.elementos) {
        if (cnt > topCount) {
          topCount = cnt;
          topSelector = sel;
        }
      }
      return {
        x: g.x,
        y: g.y,
        count: g.count,
        pageUrl: g.pageUrl,
        elementSelector: topSelector || "—",
      };
    });

  return NextResponse.json({ paginas, pontos });
}
