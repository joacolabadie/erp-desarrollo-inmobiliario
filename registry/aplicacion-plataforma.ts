import ModulosAplicacionPlataforma from "@/features/plataforma/modulos/aplicacion-plataforma";
import OrganizacionesAplicacionPlataforma from "@/features/plataforma/organizaciones/aplicacion-plataforma";
import { AplicacionPlataformaRegistry } from "@/registry/types";

export const aplicacionPlataformaRegistry = {
  modulos: { component: ModulosAplicacionPlataforma },
  organizaciones: { component: OrganizacionesAplicacionPlataforma },
} as const satisfies AplicacionPlataformaRegistry;
