import OrganizacionesAplicacionPlataforma from "@/features/plataforma/organizaciones/aplicacion-plataforma";
import { AplicacionPlataformaRegistry } from "@/registry/types";

export const aplicacionPlataformaRegistry = {
  organizaciones: { component: OrganizacionesAplicacionPlataforma },
} as const satisfies AplicacionPlataformaRegistry;
