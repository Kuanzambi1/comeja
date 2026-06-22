"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const roles = [
  { value: "COMPRADOR", label: "Cliente", icon: "😋", desc: "Peça comida" },
  { value: "RESTAURANTE", label: "Restaurante", icon: "🍳", desc: "Venda mais" },
  { value: "ENTREGADOR", label: "Entregador", icon: "🛵", desc: "Ganhe dinheiro" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "COMPRADOR";

  const [form, setForm] = useState({
    email: "",
    telefone: "",
    password: "",
    role: defaultRole,
    nome: "",
    documento: "",
    veiculo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body: Record<string, string> = {
        email: form.email,
        telefone: form.telefone,
        password: form.password,
        role: form.role,
      };

      if (form.role === "RESTAURANTE") body.nome = form.nome;
      if (form.role === "ENTREGADOR") {
        body.documento = form.documento;
        body.veiculo = form.veiculo;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar");
        return;
      }

      const role = data.user.role;
      if (role === "COMPRADOR") router.push("/comprador");
      else if (role === "RESTAURANTE") router.push("/restaurante");
      else if (role === "ENTREGADOR") router.push("/entregador");
      else router.push("/auth/login");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-zinc-900 via-orange-900 to-orange-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.2),transparent_60%)]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="relative text-center max-w-md">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm text-5xl border border-white/10">
            🚀
          </div>
          <h2 className="text-3xl font-bold text-white">
            {form.role === "COMPRADOR" && "Milhares de opções de comida"}
            {form.role === "RESTAURANTE" && "Aumente seu alcance"}
            {form.role === "ENTREGADOR" && "Faça entregas e ganhe dinheiro"}
          </h2>
          <p className="mt-4 text-lg text-orange-100/80 leading-relaxed">
            {form.role === "COMPRADOR" && "Descubra restaurantes incríveis perto de você."}
            {form.role === "RESTAURANTE" && "Conecte-se com centenas de novos clientes todos os dias."}
            {form.role === "ENTREGADOR" && "Trabalhe no seu horário e receba por entrega."}
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-orange-200/60">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Rápido
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Seguro
            </span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              <span className="text-orange-600">Come</span>
              <span className="text-zinc-900">Já</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">Criar conta</h1>
          <p className="mt-1 text-zinc-500">Escolha como você quer usar a plataforma</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="animate-scale-in rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-medium text-red-700 flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Tipo de conta
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("role", opt.value)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                      form.role === opt.value
                        ? "border-orange-500 bg-orange-50 shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className={`text-xs font-semibold ${
                      form.role === opt.value ? "text-orange-600" : "text-zinc-600"
                    }`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Telefone</label>
              <input
                type="tel"
                value={form.telefone}
                onChange={(e) => updateField("telefone", e.target.value)}
                className="input-field"
                placeholder="+244 923 555 999"
              />
            </div>

            {form.role === "RESTAURANTE" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Nome do Restaurante</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  required
                  className="input-field"
                  placeholder="Ex: Burger King"
                />
              </div>
            )}

            {form.role === "ENTREGADOR" && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Documento (NIF)</label>
                  <input
                    type="text"
                    value={form.documento}
                    onChange={(e) => updateField("documento", e.target.value)}
                    required
                    className="input-field"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Veículo</label>
                  <input
                    type="text"
                    value={form.veiculo}
                    onChange={(e) => updateField("veiculo", e.target.value)}
                    required
                    className="input-field"
                    placeholder="Ex: Moto Honda CG 160"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={6}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Cadastrando...
                </span>
              ) : "Criar conta"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Já tem conta?{" "}
            <Link href="/auth/login" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
