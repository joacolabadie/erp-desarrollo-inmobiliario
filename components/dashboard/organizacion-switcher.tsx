"use client";

import { Tick02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import type { Organizacion } from "@/lib/types/dashboard";
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
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 font-medium">
                <span className="text-muted-foreground truncate text-xs">
                  Organización
                </span>
                <span className="truncate">
                  {organizacion?.nombre ?? "Seleccioná una organización"}
                </span>
              </div>
              <HugeiconsIcon
                icon={UnfoldMoreIcon}
                strokeWidth={2}
                className="ml-auto"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuGroup>
              {organizaciones.map((organizacion) => (
                <DropdownMenuItem
                  key={organizacion.id}
                  onClick={() =>
                    router.push(`/dashboard/organizaciones/${organizacion.id}`)
                  }
                >
                  {organizacion.nombre}
                  {organizacion.id === organizacionId && (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="ml-auto"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
