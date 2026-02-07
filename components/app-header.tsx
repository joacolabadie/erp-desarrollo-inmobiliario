"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

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
    const activeOrganizationName = params.organizationId
      ? (organizations.find(
          (organization) => organization.id === params.organizationId,
        )?.nombre ?? null)
      : null;

    const activeProjectName = params.projectId
      ? (projects.find((project) => project.id === params.projectId)?.nombre ??
        null)
      : null;

    const moduleItem = params.moduleSlug
      ? modules.find((moduleItem) => moduleItem.slug === params.moduleSlug)
      : undefined;

    const moduleName = moduleItem?.nombre ?? null;

    const applicationName =
      moduleItem && params.applicationSlug
        ? (moduleItem.aplicaciones.find(
            (application) => application.slug === params.applicationSlug,
          )?.nombre ?? null)
        : null;

    const platformApplicationName = params.platformApplicationSlug
      ? (platformApplications.find(
          (platformApplication) =>
            platformApplication.slug === params.platformApplicationSlug,
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
          {breadcrumb.platformApplicationName ? (
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
          ) : breadcrumb.activeOrganizationName ? (
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
