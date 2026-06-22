export function formatCents(cents: number): string {
  return new Intl.NumberFormat("pt", {
    style: "currency",
    currency: "AOA",
  }).format(cents / 100);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

export function apiError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}
