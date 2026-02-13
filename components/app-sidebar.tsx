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
import {
  Module,
  Organization,
  PlatformApplication,
  Project,
  User,
} from "@/lib/types/dashboard";
import { useParams } from "next/navigation";
import { ComponentProps } from "react";

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

  const organizationModules =
    activeOrganizationId !== null
      ? modules.filter(
          (module) => module.organizacionId === activeOrganizationId,
        )
      : [];

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
        {activeOrganizationId !== null && organizationModules.length > 0 && (
          <NavMain
            activeOrganizationId={activeOrganizationId}
            activeProjectId={activeProjectId}
            modules={organizationModules}
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
