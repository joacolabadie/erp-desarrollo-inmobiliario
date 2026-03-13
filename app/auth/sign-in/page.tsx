import { SignInForm } from "@/app/auth/sign-in/sign-in-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { next } = await searchParams;

  if (session) {
    redirect(next || "/dashboard");
  }

  return (
    <div className="grid min-h-svh place-items-center p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-semibold text-balance">
            Ingresar en ERP
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Por favor, ingresá tu correo electrónico y contraseña para ingresar
            a tu cuenta.
          </p>
        </div>
        <SignInForm next={next ?? null} />
        <p className="text-muted-foreground text-center text-sm">
          Todavía no tenés una cuenta?{" "}
          <Link
            href={
              next
                ? `/auth/sign-up?next=${encodeURIComponent(next)}`
                : "/auth/sign-up"
            }
            className="text-primary underline underline-offset-4"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
