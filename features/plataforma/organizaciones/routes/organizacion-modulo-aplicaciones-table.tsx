"use client";

import { DataTable } from "@/components/ui/data-table";
import { aplicacionesColumns } from "@/features/plataforma/organizaciones/routes/columns";
import { Aplicacion } from "@/features/plataforma/organizaciones/routes/types";

type OrganizacionModuloAplicacionesTableProps = {
  aplicaciones: Aplicacion[];
};

export function OrganizacionModuloAplicacionesTable({
  aplicaciones,
}: OrganizacionModuloAplicacionesTableProps) {
  return <DataTable columns={aplicacionesColumns} data={aplicaciones} />;
}
