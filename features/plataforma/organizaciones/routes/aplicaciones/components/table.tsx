"use client";

import { DataTable } from "@/components/ui/data-table";
import { aplicacionesColumns } from "@/features/plataforma/organizaciones/shared/columns";
import type { Aplicacion } from "@/features/plataforma/organizaciones/shared/types";

type AplicacionesTableProps = {
  aplicaciones: Aplicacion[];
};

export function AplicacionesTable({ aplicaciones }: AplicacionesTableProps) {
  return (
    <DataTable
      columns={aplicacionesColumns}
      data={aplicaciones}
      search={{ placeholder: "Buscar aplicación..." }}
      hiddenColumns={["id"]}
    />
  );
}
