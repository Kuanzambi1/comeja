export type RealtimeEvent = {
  tipo: string;
  payload?: Record<string, unknown>;
};

type Listener = (event: RealtimeEvent) => void;

const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emit(event: RealtimeEvent): void {
  for (const fn of listeners) {
    try { fn(event); } catch {}
  }
}
