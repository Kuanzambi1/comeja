type Evento = {
  tipo: string;
  pageUrl: string;
  elementSelector?: string;
  x?: number;
  y?: number;
  viewportW?: number;
  viewportH?: number;
  pageH?: number;
  metadata?: string;
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("tracker_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("tracker_sid", sid);
  }
  return sid;
}

export function enviarEvento(evento: Evento) {
  try {
    const payload = { ...evento, sessionId: getSessionId() };
    fetch("/api/rastreamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

let initialized = false;

export function initTracker() {
  if (initialized) return;
  initialized = true;

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const selector = obterSelector(target);
    enviarEvento({
      tipo: "clique",
      pageUrl: window.location.pathname,
      elementSelector: selector,
      x: Math.round(e.pageX),
      y: Math.round(e.pageY),
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      pageH: document.documentElement.scrollHeight,
    });
  });

  window.addEventListener("beforeunload", () => {
    enviarEvento({
      tipo: "saida",
      pageUrl: window.location.pathname,
    });
  });
}

export function trackPageView() {
  enviarEvento({
    tipo: "visita",
    pageUrl: window.location.pathname,
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
  });
}

export function trackCartAction(acao: "adicionar" | "remover", produtoNome: string, metadata?: string) {
  enviarEvento({
    tipo: `carrinho_${acao}`,
    pageUrl: window.location.pathname,
    elementSelector: produtoNome,
    metadata,
  });
}

export function trackConversao(pedidoId: number, valor: number) {
  enviarEvento({
    tipo: "conversao",
    pageUrl: window.location.pathname,
    metadata: JSON.stringify({ pedidoId, valor }),
  });
}

function obterSelector(el: HTMLElement | null): string {
  if (!el || el === document.body || el === document.documentElement) return "";
  if (el.id) return `#${el.id}`;
  let path: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();
    if (current.className && typeof current.className === "string") {
      const cls = current.className.trim().split(/\s+/).slice(0, 2).join(".");
      if (cls) selector += `.${cls}`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  return path.join(" > ");
}
