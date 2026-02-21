import { SetBreadcrumbExtras } from "@/components/set-breadcrumb-extras";
import { Button } from "@/components/ui/button";
import { CreateModuloForm } from "@/features/plataforma/modulos/routes/create-modulo-form";
import { auth } from "@/lib/auth";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateModuloPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "MODULOS",
  });

  if (!allowed) {
    redirect("/dashboard");
  }

  return (
    <>
      <SetBreadcrumbExtras extras={[{ label: "Crear" }]} />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Crear módulo</h1>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/plataforma/modulos">
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          </div>
          <CreateModuloForm />
        </div>
      </main>
    </>
  );
}
