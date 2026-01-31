"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="bg-sidebar border-sidebar-border sticky top-0 flex h-16 items-center border-b px-4">
      <SidebarTrigger className="-ml-1" />
    </header>
  );
}
