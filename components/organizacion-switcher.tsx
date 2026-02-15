"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Organizacion } from "@/lib/types/dashboard";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizacionSwitcherProps = {
  organizaciones: Organizacion[];
  organizacionId: string | null;
};

export function OrganizacionSwitcher({
  organizaciones,
  organizacionId,
}: OrganizacionSwitcherProps) {
  const router = useRouter();

  const organizacion =
    organizacionId !== null
      ? organizaciones.find(
          (organizacion) => organizacion.id === organizacionId,
        )
      : undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={organizaciones.length === 0}>
            <SidebarMenuButton size="lg">
              <div className="grid flex-1 font-medium">
                <span className="text-muted-foreground truncate text-xs">
                  Organización
                </span>
                <span className="truncate">
                  {organizacion?.nombre ?? "Seleccioná una organización"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
            {organizaciones.map((organizacion) => (
              <DropdownMenuItem
                key={organizacion.id}
                onClick={() =>
                  router.push(`/dashboard/organizaciones/${organizacion.id}`)
                }
              >
                {organizacion.nombre}
                {organizacion.id === organizacionId && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
