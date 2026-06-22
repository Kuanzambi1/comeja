"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dispatchCartUpdate } from "../CartIconWithBadge";
import { formatCents } from "@/lib/utils";
import { trackCartAction, trackConversao } from "@/lib/tracker";

type CartItem = {
  produtoId: number;
  nome: string;
  precoCents: number;
  quantidade: number;
  restauranteId: number;
  restauranteNome: string;
};

const paymentOptions = [
  { value: "DINHEIRO", label: "Dinheiro", icon: "💵" },
  { value: "CARTAO", label: "Cartão", icon: "💳" }
];

export default function CarrinhoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(() =>
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart") || "[]") : []
  );
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateCart(newCart: CartItem[]) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    dispatchCartUpdate();
  }

  function updateQuantidade(produtoId: number, delta: number) {
    const newCart = cart
      .map((item) => {
        if (item.produtoId !== produtoId) return item;
        const q = item.quantidade + delta;
        return q <= 0 ? null : { ...item, quantidade: q };
      })
      .filter(Boolean) as CartItem[];
    updateCart(newCart);
  }

  function removeItem(produtoId: number) {
    const item = cart.find((i) => i.produtoId === produtoId);
    if (item) trackCartAction("remover", item.nome);
    updateCart(cart.filter((i) => i.produtoId !== produtoId));
  }

  const taxaEntregaCents = 100000;
  const subtotal = cart.reduce(
    (sum, item) => sum + item.precoCents * item.quantidade,
    0
  );
  const total = subtotal + taxaEntregaCents;

  async function handleCheckout() {
    if (cart.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comprador/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itens: cart.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitarioCents: item.precoCents,
          })),
          restauranteId: cart[0].restauranteId,
          taxaEntregaCents,
          formaPagamento,
          totalCents: total,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao criar pedido");
        return;
      }

      localStorage.setItem("cart", "[]");
      setCart([]);
      dispatchCartUpdate();
      trackConversao(data.pedido.id, total);
      setSuccess("Pedido criado com sucesso!");
      setTimeout(() => router.push(`/comprador/pedidos/${data.pedido.id}`), 1500);
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card-premium p-12 text-center animate-scale-in max-w-lg mx-auto mt-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <h2 className="text-xl font-bold text-green-700">{success}</h2>
        <p className="mt-2 text-zinc-500">Redirecionando para o acompanhamento...</p>
        <div className="mt-4 flex justify-center">
          <div className="h-1.5 w-24 rounded-full bg-zinc-200 overflow-hidden">
            <div className="h-full w-full bg-orange-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">Carrinho</h1>
      <p className="text-zinc-500 mb-8">Revise seus itens antes de finalizar</p>

      {cart.length === 0 ? (
        <div className="card-premium p-16 text-center max-w-lg mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
            <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-700">Seu carrinho está vazio</h2>
          <p className="mt-2 text-zinc-500">Adicione itens de um restaurante para começar</p>
          <Link
            href="/comprador"
            className="btn-primary mt-6 inline-flex"
          >
            Ver Restaurantes
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Restaurant Header */}
          <div className="card p-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Restaurante</p>
              <p className="font-bold text-zinc-900">{cart[0].restauranteNome}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-medium text-red-700 animate-scale-in flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* Items */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.produtoId}
                className="card p-4 flex items-center justify-between animate-fade-in"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-zinc-900">{item.nome}</h3>
                  <p className="text-sm text-zinc-500">
                    {formatCents(item.precoCents)} un.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-zinc-200 overflow-hidden shadow-sm">
                    <button
                      onClick={() => updateQuantidade(item.produtoId, -1)}
                      className="flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-900">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => updateQuantidade(item.produtoId, 1)}
                      className="flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.produtoId)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-zinc-900">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "itens"})</span>
                <span className="font-medium">{formatCents(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Taxa de entrega</span>
                <span className="font-medium">{formatCents(taxaEntregaCents)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-zinc-900 border-t pt-3">
                <span>Total</span>
                <span className="text-gradient">{formatCents(total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Forma de pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormaPagamento(opt.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                      formaPagamento === opt.value
                        ? "border-orange-500 bg-orange-50 shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className={`text-xs font-semibold ${
                      formaPagamento === opt.value ? "text-orange-600" : "text-zinc-600"
                    }`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="btn-primary w-full py-4 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Processando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Finalizar Pedido
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
