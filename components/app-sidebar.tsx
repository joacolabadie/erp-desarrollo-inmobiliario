"use client";

import { NavMain } from "@/components/nav-main";
import NavPlatform from "@/components/nav-platform";
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
  Usuario,
} from "@/lib/types/dashboard";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  organizaciones: Organizacion[];
  proyectos: Proyecto[];
  modulos: Modulo[];
  plataformaAplicaciones: AplicacionPlataforma[];
  usuario: Usuario;
};

export function AppSidebar({
  organizaciones,
  proyectos,
  modulos,
  plataformaAplicaciones,
  usuario,
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
        {plataformaAplicaciones.length > 0 && (
          <NavPlatform plataformaAplicaciones={plataformaAplicaciones} />
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
        <NavUser usuario={usuario} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
