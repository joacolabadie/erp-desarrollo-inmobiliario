"use client";

import { NavMain } from "@/components/nav-main";
import { NavPlataforma } from "@/components/nav-plataforma";
import { NavUser } from "@/components/nav-user";
import { OrganizacionSwitcher } from "@/components/organizacion-switcher";
import { ProyectoSwitcher } from "@/components/proyecto-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type {
  AplicacionPlataforma,
  Modulo,
  Organizacion,
  Proyecto,
  User,
} from "@/lib/types/dashboard";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  organizaciones: Organizacion[];
  proyectos: Proyecto[];
  modulos: Modulo[];
  aplicacionesPlataforma: AplicacionPlataforma[];
  user: User;
};

export function AppSidebar({
  organizaciones,
  proyectos,
  modulos,
  aplicacionesPlataforma,
  user,
  ...props
}: AppSidebarProps) {
  const params = useParams<{ organizacionId?: string; proyectoId?: string }>();

  const organizacionId = params.organizacionId ?? null;
  const proyectoId = params.proyectoId ?? null;

  const modulosOrganizacion =
    organizacionId !== null
      ? modulos.filter((modulo) => modulo.organizacionId === organizacionId)
      : [];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizacionSwitcher
          organizaciones={organizaciones}
          organizacionId={organizacionId}
        />
        {organizacionId !== null && (
          <ProyectoSwitcher
            organizacionId={organizacionId}
            proyectos={proyectos}
            proyectoId={proyectoId}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {aplicacionesPlataforma.length > 0 && (
          <NavPlataforma aplicacionesPlataforma={aplicacionesPlataforma} />
        )}
        {organizacionId !== null && modulosOrganizacion.length > 0 && (
          <NavMain
            organizacionId={organizacionId}
            proyectoId={proyectoId}
            modulos={modulosOrganizacion}
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
