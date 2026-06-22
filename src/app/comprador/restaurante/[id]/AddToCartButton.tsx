"use client";

import { useRouter } from "next/navigation";
import { dispatchCartUpdate } from "../../CartIconWithBadge";
import { trackCartAction } from "@/lib/tracker";

type CartItem = {
  produtoId: number;
  nome: string;
  precoCents: number;
  quantidade: number;
  restauranteId: number;
  restauranteNome: string;
};

type Props = {
  produtoId: number;
  nome: string;
  precoCents: number;
  restauranteId: number;
  restauranteNome: string;
};

export default function AddToCartButton({
  produtoId,
  nome,
  precoCents,
  restauranteId,
  restauranteNome,
}: Props) {
  const router = useRouter();

  function addToCart() {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const currentRestauranteId = cart.length > 0 ? cart[0].restauranteId : null;

    if (currentRestauranteId && currentRestauranteId !== restauranteId) {
      if (
        !confirm(
          "Seu carrinho contém itens de outro restaurante. Deseja limpar e adicionar este item?"
        )
      ) {
        return;
      }
      localStorage.setItem("cart", "[]");
    }

    const existing = cart.find(
      (item: CartItem) => item.produtoId === produtoId
    );
    if (existing) {
      existing.quantidade += 1;
    } else {
      cart.push({
        produtoId,
        nome,
        precoCents,
        quantidade: 1,
        restauranteId,
        restauranteNome,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    dispatchCartUpdate();
    trackCartAction("adicionar", nome, JSON.stringify({ precoCents }));
    router.refresh();
  }

  return (
    <button
      onClick={addToCart}
      className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition"
    >
      Adicionar
    </button>
  );
}
