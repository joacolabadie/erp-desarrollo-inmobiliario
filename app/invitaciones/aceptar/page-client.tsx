"use client";

import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AceptarInvitacionClientProps = {
  token: string | null;
};

export function AceptarInvitacionClient({
  token,
}: AceptarInvitacionClientProps) {
  const router = useRouter();
  const [message, setMessage] = useState("Verificando invitacion...");

  useEffect(() => {
    async function run() {
      if (!token) {
        toast.error("La invitacion es invalida.");
        router.replace("/auth/sign-in");
        return;
      }

      const session = await authClient.getSession();

      if (!session.data?.session) {
        const next = `/invitaciones/aceptar?token=${encodeURIComponent(token)}`;

        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
        return;
      }

      setMessage("Aceptando invitacion...");

      try {
        const response = await fetch("/api/invitaciones/aceptar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const json = (await response.json().catch(() => null)) as {
          ok?: boolean;
          message?: string;
          data?: { organizacionId?: string };
        } | null;

        if (!response.ok || !json?.ok) {
          toast.error(json?.message || "No se pudo aceptar la invitacion.");
          router.replace("/dashboard");
          return;
        }

        toast.success(json.message || "Invitacion aceptada correctamente.");

        if (json.data?.organizacionId) {
          router.replace(
            `/dashboard/organizaciones/${json.data.organizacionId}`,
          );
          return;
        }

        router.replace("/dashboard");
      } catch {
        toast.error("Ocurrio un error inesperado al aceptar la invitacion.");
        router.replace("/dashboard");
      }
    }

    void run();
  }, [router, token]);

  return (
    <div className="grid min-h-svh place-items-center p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="text-muted-foreground size-6 animate-spin" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
