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

      return { ...module, applications };
    })
    .filter((module) => module.aplicaciones.length > 0);

  const buildApplicationHref = (applicationSlug: string) => {
    if (!activeProjectId) {
      return `/dashboard/organizations/${activeOrganizationId}/${applicationSlug}`;
    }

    return `/dashboard/organizations/${activeOrganizationId}/projects/${activeProjectId}/${applicationSlug}`;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarMenu>
        {filteredModules.map((module) => (
          <Collapsible key={module.id} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={module.nombre}>
                  <span>{module.nombre}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {module.aplicaciones?.map((application) => (
                    <SidebarMenuSubItem key={application.id}>
                      <SidebarMenuSubButton asChild>
                        <Link href={buildApplicationHref(application.slug)}>
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
