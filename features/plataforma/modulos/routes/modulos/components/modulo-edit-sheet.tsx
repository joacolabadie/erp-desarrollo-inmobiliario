"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModuloEditForm } from "@/features/plataforma/modulos/routes/modulos/components/modulo-edit-form";
import type { Modulo } from "@/features/plataforma/modulos/shared/types";
import type { ReactNode } from "react";

type ModuloEditSheetProps = {
  trigger: ReactNode;
  modulo: Modulo;
};

export function ModuloEditSheet({ trigger, modulo }: ModuloEditSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar módulo</SheetTitle>
          <SheetDescription>Actualizá los datos del módulo.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <ModuloEditForm modulo={modulo} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
