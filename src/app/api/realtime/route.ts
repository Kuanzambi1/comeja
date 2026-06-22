import { subscribe } from "@/lib/realtime";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue("retry: 3000\n\n");

      const unsub = subscribe((event) => {
        if (closed) return;
        try {
          controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        } catch {}
      });

      const keepAlive = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(": keepalive\n\n");
        } catch {}
      }, 15000);

      req.signal.addEventListener("abort", () => {
        closed = true;
        unsub();
        clearInterval(keepAlive);
      });
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
