"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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

type NavMainProps = {
  activeOrganizationId: string;
  activeProjectId: string | null;
  modules: Module[];
};

export function NavMain({
  activeOrganizationId,
  activeProjectId,
  modules,
}: NavMainProps) {
  const filteredModules = modules
    .map((module) => {
      const applications = module.aplicaciones.filter((application) => {
        if (activeProjectId === null) {
          return (
            application.scope === "organizacional" ||
            application.scope === "mixto"
          );
        }

        return (
          application.scope === "proyecto" || application.scope === "mixto"
        );
      });

      return {
        id: module.id,
        slug: module.slug,
        nombre: module.nombre,
        aplicaciones: applications,
      };
    })
    .filter((module) => module.aplicaciones.length > 0);

  const buildApplicationHref = (moduleSlug: string, applicationSlug: string) =>
    activeProjectId
      ? `/dashboard/organizations/${activeOrganizationId}/projects/${activeProjectId}/${moduleSlug}/${applicationSlug}`
      : `/dashboard/organizations/${activeOrganizationId}/${moduleSlug}/${applicationSlug}`;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">
        Módulos
      </SidebarGroupLabel>
      <SidebarMenu>
        {filteredModules.map((module) => (
          <Collapsible key={module.id} asChild>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-fit [&[data-state=open]>svg]:rotate-90">
                  <ChevronRight className="transition-transform" />
                  <span>{module.nombre}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {module.aplicaciones.map((application) => (
                    <SidebarMenuSubItem key={application.id}>
                      <div className="absolute top-1/2 -left-2.5 w-2.25 border-t" />
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={buildApplicationHref(
                            module.slug,
                            application.slug,
                          )}
                          className="w-fit"
                        >
                          <span>{application.nombre}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
