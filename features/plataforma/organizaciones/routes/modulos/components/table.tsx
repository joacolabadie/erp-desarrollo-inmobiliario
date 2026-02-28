"use client";

import { DataTable } from "@/components/ui/data-table";
import { modulosColumns } from "@/features/plataforma/organizaciones/shared/columns";
import type { Modulo } from "@/features/plataforma/organizaciones/shared/types";

type ModulosTableProps = {
  organizacionId: string;
  modulos: Modulo[];
};

export function ModulosTable({ organizacionId, modulos }: ModulosTableProps) {
  return (
    <DataTable
      columns={modulosColumns(organizacionId)}
      data={modulos}
      search={{ placeholder: "Buscar módulo..." }}
      hiddenColumns={["id"]}
    />
  );
}
