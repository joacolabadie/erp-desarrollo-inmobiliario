"use client";

import { authClient } from "@/lib/auth-client";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type InvitacionStatus = {
  title: string;
  description: string;
};

type AcceptInvitacionClientProps = {
  token: string | null;
};

export function AcceptInvitacionClient({ token }: AcceptInvitacionClientProps) {
  const router = useRouter();

  const [invitacionStatus, setInvitacionStatus] = useState<InvitacionStatus>({
    title: "Validando invitación",
    description: "Esperá un momento mientras verificamos los datos.",
  });

  useEffect(() => {
    async function validateInvitacion() {
      if (!token) {
        router.replace("/auth/sign-in");

        return;
      }

      const session = await authClient.getSession();

      if (!session.data) {
        const next = `/invitaciones/aceptar?token=${encodeURIComponent(token)}`;

        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);

        return;
      }

      setInvitacionStatus({
        title: "Aceptando invitación",
        description: "Estamos procesando tu acceso a la organización.",
      });

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
          toast.error(
            data.message ||
              "Ocurrió un error inesperado al aceptar la invitación.",
          );

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
    <div className="grid min-h-svh place-items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-2 text-center">
          <div className="text-muted-foreground mx-auto size-4 animate-spin">
            <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-balance">
              {invitacionStatus.title}
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              {invitacionStatus.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
