"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { moduloDeleteAction } from "@/features/plataforma/modulos/shared/actions";
import type { Modulo } from "@/features/plataforma/modulos/shared/types";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

type ModuloDeleteDialogProps = {
  trigger: ReactNode;
  modulo: Modulo;
};

export function ModuloDeleteDialog({
  trigger,
  modulo,
}: ModuloDeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onDelete() {
    setIsSubmitting(true);

    try {
      const response = await moduloDeleteAction({
        moduloId: modulo.id,
      });

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al eliminar el módulo.",
        );

        return;
      }

      toast.success("Módulo eliminado correctamente.");

      setOpen(false);

      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado al eliminar el módulo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar módulo</DialogTitle>
          <DialogDescription>
            Esta acción eliminará el módulo <strong>{modulo.nombre}</strong> y
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={onDelete}
          >
            {isSubmitting && (
              <HugeiconsIcon
                icon={Loading03Icon}
                strokeWidth={2}
                className="animate-spin"
              />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
