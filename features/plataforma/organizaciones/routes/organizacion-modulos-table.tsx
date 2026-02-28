"use client";

import { DataTable } from "@/components/ui/data-table";
import { modulosColumns } from "@/features/plataforma/organizaciones/routes/columns";
import type { Modulo } from "@/features/plataforma/organizaciones/routes/types";

type OrganizacionModulosTableProps = {
  organizacionId: string;
  modulos: Modulo[];
};

export function OrganizacionModulosTable({
  organizacionId,
  modulos,
}: OrganizacionModulosTableProps) {
  return (
    <DataTable
      columns={modulosColumns(organizacionId)}
      data={modulos}
      search={{ placeholder: "Buscar módulo..." }}
      hiddenColumns={["id"]}
    />
  );
}
