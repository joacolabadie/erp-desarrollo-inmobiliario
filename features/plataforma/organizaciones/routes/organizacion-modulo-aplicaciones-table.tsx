"use client";

import { DataTable } from "@/components/ui/data-table";
import { aplicacionesColumns } from "@/features/plataforma/organizaciones/routes/columns";
import type { Aplicacion } from "@/features/plataforma/organizaciones/routes/types";

type OrganizacionModuloAplicacionesTableProps = {
  aplicaciones: Aplicacion[];
};

export function OrganizacionModuloAplicacionesTable({
  aplicaciones,
}: OrganizacionModuloAplicacionesTableProps) {
  return (
    <DataTable
      columns={aplicacionesColumns}
      data={aplicaciones}
      search={{ placeholder: "Buscar aplicación..." }}
      hiddenColumns={["id"]}
    />
  );
}
