"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AplicacionEditForm } from "@/features/plataforma/modulos/routes/aplicaciones/components/aplicacion-edit-form";
import type { Aplicacion } from "@/features/plataforma/modulos/shared/types";
import type { ReactNode } from "react";

type AplicacionEditSheetProps = {
  trigger: ReactNode;
  moduloId: string;
  aplicacion: Aplicacion;
};

export function AplicacionEditSheet({
  trigger,
  moduloId,
  aplicacion,
}: AplicacionEditSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar aplicación</SheetTitle>
          <SheetDescription>
            Actualizá los datos de la aplicación.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <AplicacionEditForm moduloId={moduloId} aplicacion={aplicacion} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
