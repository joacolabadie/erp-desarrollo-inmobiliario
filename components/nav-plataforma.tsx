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

type NavPlataformaProps = {
  aplicacionesPlataforma: AplicacionPlataforma[];
};

export function NavPlataforma({ aplicacionesPlataforma }: NavPlataformaProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">
        Plataforma
      </SidebarGroupLabel>
      <SidebarMenu>
        {aplicacionesPlataforma.map((aplicacionPlataforma) => (
          <SidebarMenuItem key={aplicacionPlataforma.id}>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/plataforma/${aplicacionPlataforma.slug}`}>
                <span>{aplicacionPlataforma.nombre}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
