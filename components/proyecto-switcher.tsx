"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Proyecto } from "@/lib/types/dashboard";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

type ProyectoSwitcherProps = {
  organizacionId: string;
  proyectos: Proyecto[];
  proyectoId: string | null;
};

export function ProyectoSwitcher({
  organizacionId,
  proyectos,
  proyectoId,
}: ProyectoSwitcherProps) {
  const router = useRouter();

  const proyectosOrganizacion = proyectos.filter(
    (proyecto) => proyecto.organizacionId === organizacionId,
  );

  const proyecto =
    proyectoId !== null
      ? proyectosOrganizacion.find((proyecto) => proyecto.id === proyectoId)
      : undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid font-medium">
                <span className="text-muted-foreground truncate text-xs">
                  Proyecto
                </span>
                <span className="truncate">
                  {proyecto?.nombre ?? "Vista general"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/organizaciones/${organizacionId}`)
                }
              >
                Vista general
                {proyectoId === null && <Check className="ml-auto" />}
              </DropdownMenuItem>
              {proyectosOrganizacion.map((proyecto) => (
                <DropdownMenuItem
                  key={proyecto.id}
                  onClick={() =>
                    router.push(
                      `/dashboard/organizaciones/${organizacionId}/proyectos/${proyecto.id}`,
                    )
                  }
                >
                  {proyecto.nombre}
                  {proyecto.id === proyectoId && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
