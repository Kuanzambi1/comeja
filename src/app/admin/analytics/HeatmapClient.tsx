"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type PaginaInfo = {
  pageUrl: string;
  total: number;
  ultimo: string;
};

type PontoInfo = {
  x: number;
  y: number;
  count: number;
  pageUrl: string;
  elementSelector: string;
};

export default function HeatmapClient() {
  const [paginas, setPaginas] = useState<PaginaInfo[]>([]);
  const [pontos, setPontos] = useState<PontoInfo[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    pageUrl: string;
    elementSelector: string;
    x: number;
    y: number;
    count: number;
  } | null>(null);
  const tooltipPosRef = useRef({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  async function fetchData(pageUrl?: string) {
    setLoading(true);
    setTooltip(null);
    try {
      const params = pageUrl ? `?pageUrl=${encodeURIComponent(pageUrl)}` : "";
      const res = await fetch(`/api/admin/heatmap${params}`);
      const d = await res.json();
      setPaginas(d.paginas || []);
      setPontos(d.pontos || []);
      if (!pageUrl && d.paginas?.length > 0) {
        setSelectedPage(d.paginas[0].pageUrl);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPage) fetchData(selectedPage);
  }, [selectedPage]);

  function showTooltip(
    p: PontoInfo,
    clientX: number,
    clientY: number
  ) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    setTooltip({
      pageUrl: p.pageUrl,
      elementSelector: p.elementSelector,
      x: p.x,
      y: p.y,
      count: p.count,
    });
    tooltipPosRef.current = {
      left: clientX - rect.left + 16,
      top: clientY - rect.top - 10,
    };
  }

  const onMouseEnter = useCallback((p: PontoInfo, e: React.MouseEvent) => {
    showTooltip(p, e.clientX, e.clientY);
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    if (!tooltip) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    tooltipPosRef.current = {
      left: e.clientX - rect.left + 16,
      top: e.clientY - rect.top - 10,
    };
  }

  function onMouseLeave() {
    setTooltip(null);
  }

  const maxCount = Math.max(...pontos.map((p) => p.count), 1);

  return (
    <div>
      {/* Page selector */}
      {paginas.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            Filtrar por página
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full sm:w-80 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
          >
            {paginas.map((p) => (
              <option key={p.pageUrl} value={p.pageUrl}>
                {p.pageUrl} ({p.total} cliques)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Canvas */}
      {loading ? (
        <p className="text-sm text-zinc-500">A carregar heatmap...</p>
      ) : pontos.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhum clique registado nesta página.</p>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full border border-zinc-200 rounded-xl bg-white overflow-hidden cursor-crosshair"
          style={{ height: 600 }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#fff_0%,_#f8f9fa_100%)]" />
          {pontos.map((p, i) => {
            const intensity = p.count / maxCount;
            const size = 8 + intensity * 24;
            return (
              <div
                key={i}
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all hover:z-10 hover:scale-150"
                style={{
                  left: `${Math.min(p.x, 95)}%`,
                  top: `${Math.min(p.y, 95)}%`,
                  width: size,
                  height: size,
                  background: `rgba(234, 88, 12, ${0.15 + intensity * 0.6})`,
                  border: `1px solid rgba(234, 88, 12, ${0.3 + intensity * 0.7})`,
                }}
                onMouseEnter={(e) => onMouseEnter(p, e)}
              />
            );
          })}

          {/* Tooltip */}
          {tooltip && (
            <div
              ref={tooltipRef}
              className="pointer-events-none absolute z-20 min-w-[220px] rounded-xl bg-zinc-900/95 px-4 py-3 text-xs text-white shadow-xl backdrop-blur-sm border border-white/10"
              style={{
                left: tooltipPosRef.current.left,
                top: tooltipPosRef.current.top,
                transform: "translateY(-100%)",
              }}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-zinc-400">Página</span>
                  <span className="text-right max-w-[130px] truncate font-mono text-orange-300">
                    {tooltip.pageUrl}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-zinc-400">Elemento</span>
                  <span className="text-right max-w-[130px] truncate font-mono text-green-300">
                    {tooltip.elementSelector || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-zinc-400">Posição</span>
                  <span className="text-right font-mono text-zinc-100">
                    ({tooltip.x}%, {tooltip.y}%)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-1.5">
                  <span className="font-medium text-zinc-400">Cliques</span>
                  <span className="text-right font-bold text-orange-400">
                    {tooltip.count}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
