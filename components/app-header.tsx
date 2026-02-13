"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Module,
  Organization,
  PlatformApplication,
  Project,
} from "@/lib/types/dashboard";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type AppHeaderProps = {
  organizations: Organization[];
  projects: Project[];
  modules: Module[];
  platformApplications: PlatformApplication[];
};

export function AppHeader({
  organizations,
  projects,
  modules,
  platformApplications,
}: AppHeaderProps) {
  const params = useParams<{
    organizationId?: string;
    projectId?: string;
    moduleSlug?: string;
    applicationSlug?: string;
    platformApplicationSlug?: string;
  }>();

  const breadcrumb = useMemo(() => {
    const activeOrganizationId = params.organizationId ?? null;
    const activeProjectId = params.projectId ?? null;
    const activeModuleSlug = params.moduleSlug ?? null;
    const activeApplicationSlug = params.applicationSlug ?? null;
    const activePlatformApplicationSlug =
      params.platformApplicationSlug ?? null;

    const activeOrganizationName =
      activeOrganizationId !== null
        ? (organizations.find(
            (organization) => organization.id === activeOrganizationId,
          )?.nombre ?? null)
        : null;

    const organizationProjects =
      activeOrganizationId !== null
        ? projects.filter(
            (project) => project.organizacionId === activeOrganizationId,
          )
        : [];

    const activeProjectName =
      activeProjectId !== null
        ? (organizationProjects.find(
            (project) => project.id === activeProjectId,
          )?.nombre ?? null)
        : null;

    const organizationModules =
      activeOrganizationId !== null
        ? modules.filter(
            (moduleItem) => moduleItem.organizacionId === activeOrganizationId,
          )
        : [];

    const moduleItem =
      activeModuleSlug !== null
        ? organizationModules.find(
            (moduleItem) => moduleItem.slug === activeModuleSlug,
          )
        : undefined;

    const moduleName = moduleItem?.nombre ?? null;

    const applicationName =
      moduleItem !== undefined && activeApplicationSlug !== null
        ? (moduleItem.aplicaciones.find(
            (application) => application.slug === activeApplicationSlug,
          )?.nombre ?? null)
        : null;

    const platformApplicationName =
      activePlatformApplicationSlug !== null
        ? (platformApplications.find(
            (platformApplication) =>
              platformApplication.slug === activePlatformApplicationSlug,
          )?.nombre ?? null)
        : null;

    return {
      activeOrganizationName,
      activeProjectName,
      moduleName,
      applicationName,
      platformApplicationName,
    };
  }, [
    params.organizationId,
    params.projectId,
    params.moduleSlug,
    params.applicationSlug,
    params.platformApplicationSlug,
    organizations,
    projects,
    modules,
    platformApplications,
  ]);

  return (
    <header className="bg-sidebar border-sidebar-border sticky top-0 flex h-16 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumb.platformApplicationName !== null ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>Plataforma</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {breadcrumb.platformApplicationName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : breadcrumb.activeOrganizationName !== null ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {breadcrumb.activeOrganizationName}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {breadcrumb.activeProjectName ?? "Vista general"}
                </BreadcrumbPage>
              </BreadcrumbItem>
              {breadcrumb.moduleName && breadcrumb.applicationName && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumb.moduleName}</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {breadcrumb.applicationName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
