"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { Modulo } from "@/lib/types/dashboard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type NavMainProps = {
  organizacionId: string;
  proyectoId: string | null;
  modulos: Modulo[];
};

export function NavMain({ organizacionId, proyectoId, modulos }: NavMainProps) {
  const modulosFiltrados = modulos
    .map((modulo) => {
      const aplicaciones = modulo.aplicaciones.filter((aplicacion) => {
        if (proyectoId === null) {
          return (
            aplicacion.scope === "organizacional" ||
            aplicacion.scope === "mixto"
          );
        }

        return aplicacion.scope === "proyecto" || aplicacion.scope === "mixto";
      });

      return {
        id: modulo.id,
        slug: modulo.slug,
        nombre: modulo.nombre,
        aplicaciones,
      };
    })
    .filter((modulo) => modulo.aplicaciones.length > 0);

  const construirAplicacionHref = (
    moduloSlug: string,
    aplicacionSlug: string,
  ) =>
    proyectoId !== null
      ? `/dashboard/organizaciones/${organizacionId}/proyectos/${proyectoId}/${moduloSlug}/${aplicacionSlug}`
      : `/dashboard/organizaciones/${organizacionId}/${moduloSlug}/${aplicacionSlug}`;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">
        Módulos
      </SidebarGroupLabel>
      <SidebarMenu>
        {modulosFiltrados.map((modulo) => (
          <Collapsible key={modulo.id} asChild>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="[&[data-state=open]>svg]:rotate-90">
                  <span>{modulo.nombre}</span>
                  <ChevronRight className="ml-auto transition-transform" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mr-0 pr-0">
                  {modulo.aplicaciones.map((aplicacion) => (
                    <SidebarMenuSubItem key={aplicacion.id}>
                      <div className="absolute top-1/2 -left-2.5 w-2.25 border-t" />
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={construirAplicacionHref(
                            modulo.slug,
                            aplicacion.slug,
                          )}
                        >
                          <span>{aplicacion.nombre}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
