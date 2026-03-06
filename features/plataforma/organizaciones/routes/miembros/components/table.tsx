"use client";

import { DataTable } from "@/components/ui/data-table";
import { InvitacionSendSheet } from "@/features/plataforma/organizaciones/routes/miembros/components/invitacion-send-sheet";
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
      actionSlot={<InvitacionSendSheet organizacionId={organizacionId} />}
      hiddenColumns={["id"]}
    />
  );
}
