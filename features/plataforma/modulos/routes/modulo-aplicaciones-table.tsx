"use client";

import { DataTable } from "@/components/ui/data-table";
import { aplicacionesColumns } from "@/features/plataforma/modulos/routes/columns";
import type { Aplicacion } from "@/features/plataforma/modulos/routes/types";

type ModuloAplicacionesTableProps = {
  moduloId: string;
  aplicaciones: Aplicacion[];
};

export function ModuloAplicacionesTable({
  moduloId,
  aplicaciones,
}: ModuloAplicacionesTableProps) {
  return (
    <DataTable
      columns={aplicacionesColumns(moduloId)}
      data={aplicaciones}
      search={{ placeholder: "Buscar aplicación..." }}
      action={{
        label: "Crear aplicación",
        href: `/dashboard/plataforma/modulos/${moduloId}/aplicaciones/crear`,
        iconName: "plus",
      }}
      hiddenColumns={["id"]}
    />
  );
}
