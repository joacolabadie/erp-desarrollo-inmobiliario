"use client";

import { DataTable } from "@/components/ui/data-table";
import { organizacionesColumns } from "@/features/plataforma/organizaciones/shared/columns";
import type { Organizacion } from "@/features/plataforma/organizaciones/shared/types";

type OrganizacionesTableProps = {
  organizaciones: Organizacion[];
};

export function OrganizacionesTable({
  organizaciones,
}: OrganizacionesTableProps) {
  return (
    <DataTable
      columns={organizacionesColumns}
      data={organizaciones}
      search={{ placeholder: "Buscar organización..." }}
      action={{
        label: "Crear organización",
        href: "/dashboard/plataforma/organizaciones/crear",
        iconName: "plus",
      }}
      hiddenColumns={["id"]}
    />
  );
}
