"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

type Modulo = {
  id: string;
  clave: string;
  slug: string;
  nombre: string;
};

export const modulosColumns: ColumnDef<Modulo>[] = [
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
