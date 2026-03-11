"use client";

import { useBreadcrumbExtras } from "@/components/breadcrumb-extras";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useMemo } from "react";

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

  const { extras } = useBreadcrumbExtras();

  const aplicacionPlataformHref = params.aplicacionPlataformaSlug
    ? `/dashboard/plataforma/${params.aplicacionPlataformaSlug}`
    : null;

  const aplicacionHref =
    params.organizacionId && params.moduloSlug && params.aplicacionSlug
      ? params.proyectoId
        ? `/dashboard/organizaciones/${params.organizacionId}/proyectos/${params.proyectoId}/${params.moduloSlug}/${params.aplicacionSlug}`
        : `/dashboard/organizaciones/${params.organizacionId}/${params.moduloSlug}/${params.aplicacionSlug}`
      : null;

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
    <header className="bg-sidebar border-sidebar-border flex h-16 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
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
                  {extras.length > 0 && aplicacionPlataformHref !== null ? (
                    <BreadcrumbLink asChild>
                      <Link href={aplicacionPlataformHref}>
                        {breadcrumb.nombreAplicacionPlataforma}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>
                      {breadcrumb.nombreAplicacionPlataforma}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {extras.map((extra) => (
                  <Fragment key={extra.key}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {extra.href !== null ? (
                        <BreadcrumbLink asChild>
                          <Link href={extra.href}>{extra.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{extra.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
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
                      {extras.length > 0 && aplicacionHref !== null ? (
                        <BreadcrumbLink asChild>
                          <Link href={aplicacionHref}>
                            {breadcrumb.nombreAplicacion}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>
                          {breadcrumb.nombreAplicacion}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {extras.map((extra) => (
                      <Fragment key={extra.key}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {extra.href !== null ? (
                            <BreadcrumbLink asChild>
                              <Link href={extra.href}>{extra.label}</Link>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{extra.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    ))}
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
