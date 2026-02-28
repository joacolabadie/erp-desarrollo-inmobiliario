"use client";

import { DataTable } from "@/components/ui/data-table";
import { modulosColumns } from "@/features/plataforma/modulos/routes/columns";
import type { Modulo } from "@/features/plataforma/modulos/routes/types";

type ModulosTableProps = {
  modulos: Modulo[];
};

export function ModulosTable({ modulos }: ModulosTableProps) {
  return (
    <DataTable
      columns={modulosColumns}
      data={modulos}
      search={{ placeholder: "Buscar módulo..." }}
      action={{
        label: "Crear módulo",
        href: "/dashboard/plataforma/modulos/crear",
        iconName: "plus",
      }}
      hiddenColumns={["id"]}
    />
  );
}
