"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { ProjectSwitcher } from "@/components/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import * as React from "react";

type Organization = {
  id: string;
  nombre: string;
};

type Project = {
  id: string;
  nombre: string;
};

type Application = {
  id: string;
  clave: string;
  slug: string;
  nombre: string;
  scope: "organizacional" | "proyecto" | "mixto";
};

type Module = {
  id: string;
  clave: string;
  nombre: string;
  aplicaciones: Application[];
};

type User = {
  name: string;
  email: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  organizations: Organization[];
  projects: Project[];
  modules: Module[];
  user: User;
};

export function AppSidebar({
  organizations,
  projects,
  modules,
  user,
  ...props
}: AppSidebarProps) {
  const params = useParams<{ organizationId: string; projectId?: string }>();

  const activeOrganizationId = params.organizationId;
  const activeProjectId = params.projectId ?? null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          organizations={organizations}
          activeOrganizationId={activeOrganizationId}
        />
        <ProjectSwitcher
          activeOrganizationId={activeOrganizationId}
          projects={projects}
          activeProjectId={activeProjectId}
        />
      </SidebarHeader>
      <SidebarContent>
        {modules.length > 0 && (
          <NavMain
            activeOrganizationId={activeOrganizationId}
            activeProjectId={activeProjectId}
            modules={modules}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
