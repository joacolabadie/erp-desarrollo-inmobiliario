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
  const { isMobile, state } = useSidebar();

  const side = isMobile ? "bottom" : state === "expanded" ? "bottom" : "right";

  const isOrganizationView = activeProjectId === null;

  const activeProject = isOrganizationView
    ? null
    : projects.find((project) => project.id === activeProjectId);

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
                {isOrganizationView
                  ? "VG"
                  : activeProject?.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {isOrganizationView ? "Vista General" : activeProject?.nombre}
                </span>
                <span className="truncate text-xs">Proyecto</span>
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
              Proyectos
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/organizations/${activeOrganizationId}`)
              }
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border text-xs">
                VG
              </div>
              Vista General
            </DropdownMenuItem>
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() =>
                  router.push(
                    `/dashboard/organizations/${activeOrganizationId}/projects/${project.id}`,
                  )
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border text-xs">
                  {project.nombre.charAt(0).toUpperCase()}
                </div>
                {project.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
