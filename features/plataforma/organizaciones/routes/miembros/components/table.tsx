"use client";

import { DataTable } from "@/components/ui/data-table";
import { miembrosColumns } from "@/features/plataforma/organizaciones/shared/columns";
import type { Miembro } from "@/features/plataforma/organizaciones/shared/types";

type MiembrosTableProps = {
  miembros: Miembro[];
};

export function MiembrosTable({ miembros }: MiembrosTableProps) {
  return (
    <DataTable
      columns={miembrosColumns}
      data={miembros}
      search={{ placeholder: "Buscar miembro..." }}
      hiddenColumns={["id"]}
    />
  );
}
