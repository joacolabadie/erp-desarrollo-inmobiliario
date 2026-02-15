"use client";

import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type {
  AplicacionPlataforma,
  Modulo,
  Organizacion,
  Proyecto,
} from "@/lib/types/dashboard";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type AppHeaderProps = {
  organizaciones: Organizacion[];
  proyectos: Proyecto[];
  modulos: Modulo[];
  plataformaAplicaciones: AplicacionPlataforma[];
};

export function AppHeader({
  organizaciones,
  proyectos,
  modulos,
  plataformaAplicaciones,
}: AppHeaderProps) {
  const params = useParams<{
    organizacionId?: string;
    proyectoId?: string;
    moduloSlug?: string;
    aplicacionSlug?: string;
    plataformaAplicacionSlug?: string;
  }>();

  const breadcrumb = useMemo(() => {
    const organizacionId = params.organizacionId ?? null;
    const proyectoId = params.proyectoId ?? null;
    const moduloSlug = params.moduloSlug ?? null;
    const aplicacionSlug = params.aplicacionSlug ?? null;
    const plataformaAplicacionSlug = params.plataformaAplicacionSlug ?? null;

    const nombreOrganizacion =
      organizacionId !== null
        ? (organizaciones.find(
            (organizacion) => organizacion.id === organizacionId,
          )?.nombre ?? null)
        : null;

    const proyectosOrganizacion =
      organizacionId !== null
        ? proyectos.filter(
            (proyecto) => proyecto.organizacionId === organizacionId,
          )
        : [];

    const nombreProyecto =
      proyectoId !== null
        ? (proyectosOrganizacion.find((proyecto) => proyecto.id === proyectoId)
            ?.nombre ?? null)
        : null;

    const modulosOrganizacion =
      organizacionId !== null
        ? modulos.filter((modulo) => modulo.organizacionId === organizacionId)
        : [];

    const modulo =
      moduloSlug !== null
        ? modulosOrganizacion.find((modulo) => modulo.slug === moduloSlug)
        : undefined;

    const nombreModulo = modulo?.nombre ?? null;

    const nombreAplicacion =
      modulo !== undefined && aplicacionSlug !== null
        ? (modulo.aplicaciones.find(
            (aplicacion) => aplicacion.slug === aplicacionSlug,
          )?.nombre ?? null)
        : null;

    const nombrePlataformaAplicacion =
      plataformaAplicacionSlug !== null
        ? (plataformaAplicaciones.find(
            (plataformaAplicacion) =>
              plataformaAplicacion.slug === plataformaAplicacionSlug,
          )?.nombre ?? null)
        : null;

    return {
      nombreOrganizacion,
      nombreProyecto,
      nombreModulo,
      nombreAplicacion,
      nombrePlataformaAplicacion,
    };
  }, [
    params.organizacionId,
    params.proyectoId,
    params.moduloSlug,
    params.aplicacionSlug,
    params.plataformaAplicacionSlug,
    organizaciones,
    proyectos,
    modulos,
    plataformaAplicaciones,
  ]);

  return (
    <header className="bg-sidebar border-sidebar-border sticky top-0 flex h-16 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.nombrePlataformaAplicacion !== null ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage>Plataforma</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumb.nombrePlataformaAplicacion}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : breadcrumb.nombreOrganizacion !== null ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumb.nombreOrganizacion}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumb.nombreProyecto ?? "Vista general"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {breadcrumb.nombreModulo && breadcrumb.nombreAplicacion && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb.nombreModulo}</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {breadcrumb.nombreAplicacion}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ModeToggle />
    </header>
  );
}
