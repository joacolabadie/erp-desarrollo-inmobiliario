"use client";

import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AceptarInvitacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [message, setMessage] = useState("Validando invitación...");

  useEffect(() => {
    async function validateInvitacion() {
      if (!token) {
        toast.error("La invitación no existe o ya no es válida.");

        router.replace("/auth/sign-in");

        return;
      }

      const session = await authClient.getSession();

      if (!session.data) {
        const next = `/invitaciones/aceptar?token=${encodeURIComponent(token)}`;

        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);

        return;
      }

      setMessage("Aceptando invitación...");

      try {
        const response = await fetch("/api/invitaciones/aceptar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          toast.error(data.message || "No se pudo aceptar la invitación.");

          router.replace("/dashboard");

          return;
        }

        toast.success(data.message || "Invitación aceptada correctamente.");

        router.replace("/dashboard");
      } catch {
        toast.error("Ocurrió un error inesperado al aceptar la invitación.");

        router.replace("/dashboard");
      }
    }

    validateInvitacion();
  }, [router, token]);

  return (
    <div className="grid h-svh place-items-center px-4 py-12">
      <div className="text-center">
        <div className="flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" />
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
