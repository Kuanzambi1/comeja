import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicRoutes = ["/", "/auth/login", "/auth/register"];

const roleRoutes: Record<string, string[]> = {
  COMPRADOR: ["/comprador"],
  RESTAURANTE: ["/restaurante"],
  ENTREGADOR: ["/entregador"],
  ADMIN: ["/admin"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.userId));
    requestHeaders.set("x-user-role", payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = payload.role;
  const allowedPrefix = roleRoutes[role];

  if (!allowedPrefix || !allowedPrefix.some((prefix) => pathname.startsWith(prefix))) {
    if (role === "COMPRADOR") return NextResponse.redirect(new URL("/comprador", request.url));
    if (role === "RESTAURANTE") return NextResponse.redirect(new URL("/restaurante", request.url));
    if (role === "ENTREGADOR") return NextResponse.redirect(new URL("/entregador", request.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
