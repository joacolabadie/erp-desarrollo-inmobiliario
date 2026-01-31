"use client";

import { NavMain } from "@/components/nav-main";
import NavPlatform from "@/components/nav-platform";
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
import { ComponentProps } from "react";

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
  slug: string;
  nombre: string;
  scope: "organizacional" | "proyecto" | "mixto";
};

type Module = {
  id: string;
  slug: string;
  nombre: string;
  aplicaciones: Application[];
};

type PlatformApplication = {
  id: string;
  slug: string;
  nombre: string;
};

type User = {
  name: string;
  email: string;
};

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  organizations: Organization[];
  projects: Project[];
  modules: Module[];
  platformApplications: PlatformApplication[];
  user: User;
};

export function AppSidebar({
  organizations,
  projects,
  modules,
  platformApplications,
  user,
  ...props
}: AppSidebarProps) {
  const params = useParams<{ organizationId?: string; projectId?: string }>();

  const activeOrganizationId = params.organizationId ?? null;
  const activeProjectId = params.projectId ?? null;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          organizations={organizations}
          activeOrganizationId={activeOrganizationId}
        />
        {activeOrganizationId !== null && (
          <ProjectSwitcher
            activeOrganizationId={activeOrganizationId}
            projects={projects}
            activeProjectId={activeProjectId}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {platformApplications.length > 0 && (
          <NavPlatform platformApplications={platformApplications} />
        )}
        {activeOrganizationId !== null && modules.length > 0 && (
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
