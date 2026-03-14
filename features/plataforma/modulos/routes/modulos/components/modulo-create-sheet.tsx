"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModuloCreateForm } from "@/features/plataforma/modulos/routes/modulos/components/modulo-create-form";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ModuloCreateSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <HugeiconsIcon icon={AddIcon} strokeWidth={2} />
          Crear módulo
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Crear módulo</SheetTitle>
          <SheetDescription>Completá los datos del módulo.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <ModuloCreateForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
