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
      <header className="sticky top-0 z-40 glass border-b border-zinc-100/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/entregador" className="text-xl font-extrabold tracking-tight">
            <span className="text-orange-600">Come</span>
            <span className="text-zinc-900">Já</span>
            <span className="ml-2 text-[11px] font-semibold text-green-600 bg-green-50 rounded-full px-2 py-0.5">Entregador</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/entregador">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              Dashboard
            </NavLink>
            <NavLink href="/entregador/pedidos">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              Entregas
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-zinc-500">
              Olá, <span className="font-semibold text-zinc-800">{user.nome}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
    >
      {children}
    </Link>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button className="btn-ghost text-sm text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
        Sair
      </button>
    </form>
  );
}
