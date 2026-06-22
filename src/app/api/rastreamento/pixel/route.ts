import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ref = req.headers.get("referer") || url.searchParams.get("url") || "/";
    const sessionId = url.searchParams.get("sid") || crypto.randomUUID();

    await prisma.eventoRastreamento.create({
      data: {
        tipo: "visita",
        sessionId,
        pageUrl: ref,
        metadata: JSON.stringify({
          userAgent: req.headers.get("user-agent"),
          source: "pixel",
        }),
      },
    });

    return new NextResponse(PIXEL, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return new NextResponse(PIXEL, {
      headers: { "Content-Type": "image/gif" },
    });
  }
}
