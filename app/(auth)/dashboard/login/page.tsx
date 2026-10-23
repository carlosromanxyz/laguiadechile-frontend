import { redirect } from "next/navigation";
import { LDCLoginForm } from "@/components/molecules/ldc-login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Iniciar sesión — La Guía de Chile",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-semibold">LG</span>
          </div>
          <CardTitle className="text-xl">La Guía de Chile</CardTitle>
          <CardDescription>Panel de administración</CardDescription>
        </CardHeader>
        <CardContent>
          <LDCLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
