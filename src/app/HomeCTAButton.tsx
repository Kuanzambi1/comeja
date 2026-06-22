"use client";

import { useRouter } from "next/navigation";

type Props = {
  texto: string;
  href: string;
  icone: string;
};

export default function HomeCTAButton({ texto, href, icone }: Props) {
  const router = useRouter();

  function handleClick() {
    let sid = document.cookie.replace(/(?:(?:^|.*;\s*)ab_session\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!sid) {
      sid = crypto.randomUUID();
      document.cookie = `ab_session=${sid}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
    fetch("/api/rastreamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: "clique",
        sessionId: sid,
        pageUrl: "/",
        elementSelector: ".home-cta-button",
        metadata: JSON.stringify({ variante: texto, acao: "cta_home" }),
      }),
      keepalive: true,
    }).catch(() => {});
    router.push(href);
  }

  return (
    <button
      onClick={handleClick}
      className="home-cta-button group relative inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 flex items-center gap-2">
        {texto}
        <span className="text-lg">{icone}</span>
      </span>
    </button>
  );
}
