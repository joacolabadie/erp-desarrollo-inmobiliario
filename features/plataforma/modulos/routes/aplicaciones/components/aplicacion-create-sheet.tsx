"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AplicacionCreateForm } from "@/features/plataforma/modulos/routes/aplicaciones/components/aplicacion-create-form";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type AplicacionCreateSheetProps = {
  moduloId: string;
};

export function AplicacionCreateSheet({
  moduloId,
}: AplicacionCreateSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <HugeiconsIcon icon={AddIcon} strokeWidth={2} />
          Crear aplicación
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Crear aplicación</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <AplicacionCreateForm moduloId={moduloId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
