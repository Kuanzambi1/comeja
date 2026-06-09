import { getAuthUser } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return apiError("Não autenticado", 401);
  return Response.json({ user });
}
