"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { AplicacionPlataforma } from "@/lib/types/dashboard";
import Link from "next/link";

type NavPlatformProps = {
  plataformaAplicaciones: AplicacionPlataforma[];
};

export default function NavPlatform({
  plataformaAplicaciones,
}: NavPlatformProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">
        Plataforma
      </SidebarGroupLabel>
      <SidebarMenu>
        {plataformaAplicaciones.map((plataformaAplicacion) => (
          <SidebarMenuItem key={plataformaAplicacion.id}>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/plataforma/${plataformaAplicacion.slug}`}>
                <span>{plataformaAplicacion.nombre}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
