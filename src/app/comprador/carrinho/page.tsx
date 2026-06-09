"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CartItem = {
  produtoId: number;
  nome: string;
  precoCents: number;
  quantidade: number;
  restauranteId: number;
  restauranteNome: string;
};

export default function CarrinhoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  function updateCart(newCart: CartItem[]) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
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
    updateCart(cart.filter((item) => item.produtoId !== produtoId));
  }

  const taxaEntregaCents = 500;
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
      <div className="card p-12 text-center animate-scale-in">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-xl font-bold text-green-700">{success}</h2>
        <p className="mt-2 text-zinc-500">Redirecionando para o acompanhamento...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">Carrinho</h1>
      <p className="text-zinc-500 mb-8">Revise seus itens antes de finalizar</p>

      {cart.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
              🏪
            </div>
            <div>
              <p className="text-sm text-zinc-500">Restaurante</p>
              <p className="font-bold text-zinc-900">{cart[0].restauranteNome}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-medium text-red-700 animate-scale-in">
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
                    R$ {(item.precoCents / 100).toFixed(2)} un.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-zinc-200 overflow-hidden">
                    <button
                      onClick={() => updateQuantidade(item.produtoId, -1)}
                      className="flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-zinc-100 transition font-medium"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-900">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => updateQuantidade(item.produtoId, 1)}
                      className="flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-zinc-100 transition font-medium"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.produtoId)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition"
                  >
                    🗑️
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
                <span>Subtotal ({cart.length} itens)</span>
                <span className="font-medium">R$ {(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Taxa de entrega</span>
                <span className="font-medium">R$ {(taxaEntregaCents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-zinc-900 border-t pt-3">
                <span>Total</span>
                <span className="text-orange-600">R$ {(total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Forma de pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "DINHEIRO", label: "Dinheiro", icon: "💵" },
                  { value: "CARTAO", label: "Cartão", icon: "💳" },
                  { value: "PIX", label: "PIX", icon: "📱" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormaPagamento(opt.value)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                      formaPagamento === opt.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-zinc-200 hover:border-zinc-300"
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
                  <span className="text-lg">→</span>
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
