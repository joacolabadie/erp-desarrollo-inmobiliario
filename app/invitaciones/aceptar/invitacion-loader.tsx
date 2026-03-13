"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type InvitacionLoaderProps = {
  token: string;
};

export function InvitacionLoader({ token }: InvitacionLoaderProps) {
  const router = useRouter();

  useEffect(() => {
    async function acceptInvitacion() {
      try {
        await fetch("/api/invitaciones/aceptar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      } finally {
        router.replace("/dashboard");
      }
    }

    void acceptInvitacion();
  }, [router, token]);

  return (
    <div className="grid min-h-svh place-items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-1 text-center">
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={2}
            className="mx-auto size-4 animate-spin"
          />
          <p className="text-muted-foreground text-sm text-balance">
            Estamos procesando tu invitación.
          </p>
        </div>
      </div>
    </div>
  );
}
