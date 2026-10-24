import { redirect } from "next/navigation";
import { LDCAuthCard } from "@/components/molecules/ldc-auth-card";
import { LDCLoginForm } from "@/components/organisms/ldc-login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Iniciar sesión — La Guía de Chile",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <LDCAuthCard title="La Guía de Chile" description="Panel de administración">
        <LDCLoginForm />
      </LDCAuthCard>
    </div>
  );
}
