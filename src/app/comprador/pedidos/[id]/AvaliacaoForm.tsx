"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AvaliacaoForm({ pedidoId }: { pedidoId: number }) {
  const router = useRouter();
  const [notaRestaurante, setNotaRestaurante] = useState(5);
  const [notaEntregador, setNotaEntregador] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/comprador/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId, notaRestaurante, notaEntregador, comentario }),
    });

    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 mt-4 animate-fade-in"
    >
      <h2 className="font-bold text-zinc-900 text-lg mb-1">Avaliar Pedido</h2>
      <p className="text-sm text-zinc-500 mb-6">Sua opinião é importante para melhorarmos</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nota do Restaurante
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNotaRestaurante(n)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                  n <= notaRestaurante
                    ? "bg-yellow-100 text-yellow-500 scale-110"
                    : "bg-zinc-100 text-zinc-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nota do Entregador
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNotaEntregador(n)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                  n <= notaEntregador
                    ? "bg-yellow-100 text-yellow-500 scale-110"
                    : "bg-zinc-100 text-zinc-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Conte como foi sua experiência..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? "Enviando..." : "Enviar Avaliação"}
        </button>
      </div>
    </form>
  );
}
