import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Ingresar en ERP</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Por favor, ingresá tu correo electrónico y contraseña para ingresar
            a tu cuenta.
          </p>
        </div>
        <SignInForm />
        <p className="text-muted-foreground text-center text-sm">
          Todavía no tenés una cuenta?{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary underline underline-offset-4"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
