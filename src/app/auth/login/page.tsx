"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      const role = data.user.role;
      if (role === "COMPRADOR") router.push("/comprador");
      else if (role === "RESTAURANTE") router.push("/restaurante");
      else if (role === "ENTREGADOR") router.push("/entregador");
      else if (role === "ADMIN") router.push("/admin");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              <span className="text-orange-600">Come</span>
              <span className="text-zinc-900">Já</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">Bem-vindo de volta</h1>
          <p className="mt-1 text-zinc-500">Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="animate-scale-in rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Não tem conta?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-orange-600 hover:text-orange-700 transition"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 to-orange-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="relative text-center max-w-md">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 text-5xl backdrop-blur-sm">
            🍔
          </div>
          <h2 className="text-3xl font-bold text-white">Peça com facilidade</h2>
          <p className="mt-4 text-lg text-orange-100 leading-relaxed">
            Milhares de restaurantes e entregadores prontos para atender você.
          </p>
        </div>
      </div>
    </div>
  );
}
