"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  nombre: string;
};

type OrganizationSwitcherProps = {
  organizations: Organization[];
  activeOrganizationId: string;
};

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: OrganizationSwitcherProps) {
  const { isMobile, state } = useSidebar();
  const router = useRouter();

  const side = isMobile ? "bottom" : state === "expanded" ? "bottom" : "right";

  const activeOrganization =
    organizations.find(
      (organization) => organization.id === activeOrganizationId,
    ) ?? organizations[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeOrganization.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization.nombre}
                </span>
                <span className="truncate text-xs">Organización</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={side}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizaciones
            </DropdownMenuLabel>
            {organizations.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() =>
                  router.push(`/dashboard/organizations/${organization.id}`)
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {organization.nombre.charAt(0).toUpperCase()}
                </div>
                {organization.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
