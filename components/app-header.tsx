"use client";

import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
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
  aplicacionesPlataforma: AplicacionPlataforma[];
};

export function AppHeader({
  organizaciones,
  proyectos,
  modulos,
  aplicacionesPlataforma,
}: AppHeaderProps) {
  const params = useParams<{
    organizacionId?: string;
    proyectoId?: string;
    moduloSlug?: string;
    aplicacionSlug?: string;
    aplicacionPlataformaSlug?: string;
  }>();

  const breadcrumb = useMemo(() => {
    const organizacionId = params.organizacionId ?? null;
    const proyectoId = params.proyectoId ?? null;
    const moduloSlug = params.moduloSlug ?? null;
    const aplicacionSlug = params.aplicacionSlug ?? null;
    const aplicacionPlataformaSlug = params.aplicacionPlataformaSlug ?? null;

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

    const nombreAplicacionPlataforma =
      aplicacionPlataformaSlug !== null
        ? (aplicacionesPlataforma.find(
            (aplicacionPlataforma) =>
              aplicacionPlataforma.slug === aplicacionPlataformaSlug,
          )?.nombre ?? null)
        : null;

    return {
      nombreOrganizacion,
      nombreProyecto,
      nombreModulo,
      nombreAplicacion,
      nombreAplicacionPlataforma,
    };
  }, [
    params.organizacionId,
    params.proyectoId,
    params.moduloSlug,
    params.aplicacionSlug,
    params.aplicacionPlataformaSlug,
    organizaciones,
    proyectos,
    modulos,
    aplicacionesPlataforma,
  ]);

  return (
    <header className="bg-sidebar border-sidebar-border sticky top-0 flex h-16 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.nombreAplicacionPlataforma !== null ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage>Plataforma</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumb.nombreAplicacionPlataforma}
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
