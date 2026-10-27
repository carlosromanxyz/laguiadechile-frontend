import { redirect } from "next/navigation";
import { getRoleHome } from "@/lib/dashboard/config";
import { getDashboardSession } from "@/lib/dashboard/session";

/** `/dashboard` lleva al inicio del rol: `/dashboard/{admin|comercio|usuario}`. */
export default async function DashboardIndexPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  redirect(getRoleHome(session.role));
}
