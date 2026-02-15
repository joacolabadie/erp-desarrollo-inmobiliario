import { SignUpForm } from "@/app/auth/sign-up/sign-up-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-svh place-items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-balance">
            Registrarme en ERP
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Por favor, ingresá tu correo electrónico y contraseña para crear tu
            cuenta.
          </p>
        </div>
        <SignUpForm />
        <p className="text-muted-foreground text-center text-sm">
          Ya tenés una cuenta?{" "}
          <Link
            href="/auth/sign-in"
            className="text-primary underline underline-offset-4"
          >
            Ingresá
          </Link>
        </p>
      </div>
    </div>
  );
}
