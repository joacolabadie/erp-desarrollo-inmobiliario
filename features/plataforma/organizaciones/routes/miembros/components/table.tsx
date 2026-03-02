"use client";

import { DataTable } from "@/components/ui/data-table";
import { miembrosColumns } from "@/features/plataforma/organizaciones/shared/columns";
import type { Miembro } from "@/features/plataforma/organizaciones/shared/types";

type MiembrosTableProps = {
  organizacionId: string;
  miembros: Miembro[];
};

export function MiembrosTable({
  organizacionId,
  miembros,
}: MiembrosTableProps) {
  return (
    <DataTable
      columns={miembrosColumns}
      data={miembros}
      search={{ placeholder: "Buscar miembro..." }}
      action={{
        label: "Invitar miembro",
        href: `/dashboard/plataforma/organizaciones/${organizacionId}/miembros/invitar`,
        iconName: "user-plus",
      }}
      hiddenColumns={["id"]}
    />
  );
}
