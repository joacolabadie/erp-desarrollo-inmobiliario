"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { Modulo } from "@/lib/types/dashboard";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

type NavMainProps = {
  organizacionId: string;
  proyectoId: string | null;
  modulos: Modulo[];
};

export function NavMain({ organizacionId, proyectoId, modulos }: NavMainProps) {
  const modulosFiltrados = modulos
    .map((modulo) => ({
      ...modulo,
      aplicaciones: modulo.aplicaciones.filter((aplicacion) => {
        if (proyectoId === null) {
          return (
            aplicacion.scope === "organizacional" ||
            aplicacion.scope === "mixto"
          );
        }

        return aplicacion.scope === "proyecto" || aplicacion.scope === "mixto";
      }),
    }))
    .filter((modulo) => modulo.aplicaciones.length > 0);

  const buildAplicacionHref = (moduloSlug: string, aplicacionSlug: string) =>
    proyectoId !== null
      ? `/dashboard/organizaciones/${organizacionId}/proyectos/${proyectoId}/${moduloSlug}/${aplicacionSlug}`
      : `/dashboard/organizaciones/${organizacionId}/${moduloSlug}/${aplicacionSlug}`;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">
        Módulos
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {modulosFiltrados.map((modulo) => (
            <Collapsible key={modulo.id} asChild>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="[&[data-state=open]>svg]:rotate-90">
                    <span>{modulo.nombre}</span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className="ml-auto transition-transform"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {modulo.aplicaciones.map((aplicacion) => (
                      <SidebarMenuSubItem key={aplicacion.id}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={buildAplicacionHref(
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
