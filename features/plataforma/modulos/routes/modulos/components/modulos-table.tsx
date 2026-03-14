"use client";

import { DataTable } from "@/components/ui/data-table";
import { ModuloCreateSheet } from "@/features/plataforma/modulos/routes/modulos/components/modulo-create-sheet";
import { modulosColumns } from "@/features/plataforma/modulos/shared/columns";
import type { Modulo } from "@/features/plataforma/modulos/shared/types";

type ModulosTableProps = {
  modulos: Modulo[];
};

export function ModulosTable({ modulos }: ModulosTableProps) {
  return (
    <DataTable
      columns={modulosColumns}
      data={modulos}
      search={{ placeholder: "Buscar módulo..." }}
      actionSlot={<ModuloCreateSheet />}
      hiddenColumns={["id"]}
    />
  );
}
