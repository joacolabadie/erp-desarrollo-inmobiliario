"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

type PlatformApplication = {
  id: string;
  slug: string;
  nombre: string;
};

type NavPlatformProps = {
  platformApplications: PlatformApplication[];
};

export default function NavPlatform({
  platformApplications,
}: NavPlatformProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">
        Plataforma
      </SidebarGroupLabel>
      <SidebarMenu>
        {platformApplications.map((platformApplication) => (
          <SidebarMenuItem key={platformApplication.id}>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/platform/${platformApplication.slug}`}>
                <span>{platformApplication.nombre}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
