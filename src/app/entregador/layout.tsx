import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EntregadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user || user.role !== "ENTREGADOR") redirect("/auth/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/entregador" className="text-xl font-extrabold tracking-tight">
            <span className="text-orange-600">Come</span>
            <span className="text-zinc-900">Já</span>
            <span className="ml-2 text-xs font-medium text-zinc-400 bg-zinc-100 rounded-full px-2 py-0.5">Entregador</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/entregador" icon="📊">Dashboard</NavLink>
            <NavLink href="/entregador/pedidos" icon="🛵">Entregas</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
    >
      <span className="text-base">{icon}</span>
      {children}
    </Link>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button className="btn-ghost text-sm text-red-500 hover:text-red-700 hover:bg-red-50">
        Sair
      </button>
    </form>
  );
}
