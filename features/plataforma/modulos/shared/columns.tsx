"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AplicacionEditSheet } from "@/features/plataforma/modulos/routes/aplicaciones/components/aplicacion-edit-sheet";
import { ModuloEditSheet } from "@/features/plataforma/modulos/routes/modulos/components/modulo-edit-sheet";
import type {
  Aplicacion,
  Modulo,
} from "@/features/plataforma/modulos/shared/types";
import { APLICACION_SCOPE_LABELS } from "@/lib/domain";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type AplicacionesColumnsArgs = {
  moduloId: string;
};

export const modulosColumns: ColumnDef<Modulo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "clave",
    header: "Clave",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const modulo = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  strokeWidth={2}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="whitespace-nowrap">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => navigator.clipboard.writeText(modulo.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <ModuloEditSheet
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    Editar
                  </DropdownMenuItem>
                }
                modulo={modulo}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/plataforma/modulos/${modulo.id}/aplicaciones`}
                >
                  Ver aplicaciones
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const aplicacionesColumns = ({
  moduloId,
}: AplicacionesColumnsArgs): ColumnDef<Aplicacion>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "clave",
    header: "Clave",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }) => {
      const aplicacion = row.original;

      return (
        <Badge variant="secondary">
          {APLICACION_SCOPE_LABELS[aplicacion.scope]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const aplicacion = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  strokeWidth={2}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="whitespace-nowrap">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => navigator.clipboard.writeText(aplicacion.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <AplicacionEditSheet
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    Editar
                  </DropdownMenuItem>
                }
                moduloId={moduloId}
                aplicacion={aplicacion}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
