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
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  nombre: string;
};

type ProjectSwitcherProps = {
  activeOrganizationId: string;
  projects: Project[];
  activeProjectId: string | null;
};

export function ProjectSwitcher({
  activeOrganizationId,
  projects,
  activeProjectId,
}: ProjectSwitcherProps) {
  const router = useRouter();

  const isGeneralView = activeProjectId === null;

  const activeProject = isGeneralView
    ? null
    : projects.find((project) => project.id === activeProjectId);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <div className="grid font-medium">
                <span className="text-muted-foreground truncate text-xs">
                  Proyecto
                </span>
                <span className="truncate">
                  {isGeneralView ? "Vista General" : activeProject?.nombre}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/organizations/${activeOrganizationId}`)
              }
            >
              Vista General
              {isGeneralView && <Check className="ml-auto" />}
            </DropdownMenuItem>
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() =>
                  router.push(
                    `/dashboard/organizations/${activeOrganizationId}/projects/${project.id}`,
                  )
                }
              >
                {project.nombre}
                {project.id === activeProjectId && (
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
