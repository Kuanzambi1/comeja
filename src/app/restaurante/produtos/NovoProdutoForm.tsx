"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NovoProdutoForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    precoKz: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const precoCents = Math.round(parseFloat(form.precoKz.replace(",", ".")) * 100);

    if (!precoCents || precoCents <= 0) {
      setError("Preço inválido");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/restaurante/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
        precoCents,
      }),
    });

    if (res.ok) {
      setForm({ nome: "", descricao: "", precoKz: "" });
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao criar produto");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Nome do produto"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          className="input-field flex-1"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="input-field flex-1"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Preço (Kz)"
            value={form.precoKz}
            onChange={(e) => setForm({ ...form, precoKz: e.target.value })}
            required
            className="input-field w-28"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? "..." : "Adicionar"}
          </button>
        </div>
      </div>
    </form>
  );
}
