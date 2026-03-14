"use client";

import { DataTable } from "@/components/ui/data-table";
import { AplicacionCreateSheet } from "@/features/plataforma/modulos/routes/aplicaciones/components/aplicacion-create-sheet";
import { aplicacionesColumns } from "@/features/plataforma/modulos/shared/columns";
import type { Aplicacion } from "@/features/plataforma/modulos/shared/types";
import { useMemo } from "react";

type AplicacionesTableProps = {
  moduloId: string;
  aplicaciones: Aplicacion[];
};

export function AplicacionesTable({
  moduloId,
  aplicaciones,
}: AplicacionesTableProps) {
  const columns = useMemo(() => aplicacionesColumns({ moduloId }), [moduloId]);

  return (
    <DataTable
      columns={columns}
      data={aplicaciones}
      search={{ placeholder: "Buscar aplicación..." }}
      actionSlot={<AplicacionCreateSheet moduloId={moduloId} />}
      hiddenColumns={["id"]}
    />
  );
}
