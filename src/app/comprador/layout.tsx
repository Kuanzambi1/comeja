import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function CompradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user || user.role !== "COMPRADOR") redirect("/auth/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/comprador" className="text-xl font-extrabold tracking-tight">
            <span className="text-orange-600">Come</span>
            <span className="text-zinc-900">Já</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/comprador" icon="🍽️">Restaurantes</NavLink>
            <NavLink href="/comprador/carrinho" icon="🛒">Carrinho</NavLink>
            <NavLink href="/comprador/pedidos" icon="📋">Pedidos</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-zinc-500">
              Olá, <span className="font-semibold text-zinc-800">{user.nome}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          <MobileNavLink href="/comprador" icon="🍽️" label="Restaurantes" />
          <MobileNavLink href="/comprador/carrinho" icon="🛒" label="Carrinho" />
          <MobileNavLink href="/comprador/pedidos" icon="📋" label="Pedidos" />
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 pb-20 sm:pb-6">
        {children}
      </main>
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

function MobileNavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium text-zinc-500"
    >
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}
