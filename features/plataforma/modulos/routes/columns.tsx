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
import { APLICACION_SCOPE_LABELS, type AplicacionScope } from "@/lib/domain";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

type Modulo = {
  id: string;
  clave: string;
  slug: string;
  nombre: string;
};

type Aplicacion = {
  id: string;
  moduloId: string;
  clave: string;
  slug: string;
  nombre: string;
  scope: AplicacionScope;
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="whitespace-nowrap">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(modulo.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/plataforma/modulos/${modulo.id}/editar`}
                >
                  Editar
                </Link>
              </DropdownMenuItem>
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

export const aplicacionesColumns: ColumnDef<Aplicacion>[] = [
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

      return <Badge>{APLICACION_SCOPE_LABELS[aplicacion.scope]}</Badge>;
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="whitespace-nowrap">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(aplicacion.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/plataforma/modulos/${aplicacion.moduloId}/aplicaciones/${aplicacion.id}/editar`}
                >
                  Editar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
