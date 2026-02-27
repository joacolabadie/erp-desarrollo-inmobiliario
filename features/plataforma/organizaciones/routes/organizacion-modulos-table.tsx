"use client";

import { DataTable } from "@/components/ui/data-table";
import { modulosColumns } from "@/features/plataforma/organizaciones/routes/columns";

type Modulo = {
  id: string;
  nombre: string;
};

type OrganizacionModulosTableProps = {
  organizacionId: string;
  modulos: Modulo[];
};

export function OrganizacionModulosTable({
  organizacionId,
  modulos,
}: OrganizacionModulosTableProps) {
  return <DataTable columns={modulosColumns(organizacionId)} data={modulos} />;
}
