"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

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
        {platformApplications.map((application) => (
          <SidebarMenuItem key={application.id} className="w-fit">
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/platform/${application.slug}`}>
                <span>{application.nombre}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
