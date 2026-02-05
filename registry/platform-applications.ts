import OrganizacionesPlatformApplication from "@/features/platform/organizaciones/platform-application";
import { PlatformAplicationRegistry } from "@/registry/types";

export const platformApplicationRegistry = {
  organizaciones: { component: OrganizacionesPlatformApplication },
} as const satisfies PlatformAplicationRegistry;
