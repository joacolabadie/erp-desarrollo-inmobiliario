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
import { aplicacionDeleteAction } from "@/features/plataforma/modulos/shared/actions";
import type { Aplicacion } from "@/features/plataforma/modulos/shared/types";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

type AplicacionDeleteDialogProps = {
  trigger: ReactNode;
  aplicacion: Aplicacion;
};

export function AplicacionDeleteDialog({
  trigger,
  aplicacion,
}: AplicacionDeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onDelete() {
    setIsSubmitting(true);

    try {
      const response = await aplicacionDeleteAction({
        aplicacionId: aplicacion.id,
      });

      if (!response.ok) {
        toast.error(
          response.message ||
            "Ocurrió un error inesperado al eliminar la aplicación.",
        );
        return;
      }

      toast.success("Aplicación eliminada correctamente.");

      setOpen(false);

      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado al eliminar la aplicación.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar aplicación</DialogTitle>
          <DialogDescription>
            Esta acción eliminará la aplicación{" "}
            <strong>{aplicacion.nombre}</strong> y no se puede deshacer.
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
