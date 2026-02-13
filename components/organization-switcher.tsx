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
import { Organization } from "@/lib/types/dashboard";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizationSwitcherProps = {
  organizations: Organization[];
  activeOrganizationId: string | null;
};

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: OrganizationSwitcherProps) {
  const router = useRouter();

  const activeOrganization =
    activeOrganizationId !== null
      ? organizations.find(
          (organization) => organization.id === activeOrganizationId,
        )
      : undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={organizations.length === 0}>
            <SidebarMenuButton size="lg">
              <div className="grid flex-1 font-medium">
                <span className="text-muted-foreground truncate text-xs">
                  Organización
                </span>
                <span className="truncate">
                  {activeOrganization?.nombre ?? "Seleccioná una organización"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
            {organizations.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() =>
                  router.push(`/dashboard/organizations/${organization.id}`)
                }
              >
                {organization.nombre}
                {organization.id === activeOrganizationId && (
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
