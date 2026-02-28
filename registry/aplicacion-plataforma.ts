import ModulosAplicacionPlataforma from "@/features/plataforma/modulos/aplicacion-plataforma";
import OrganizacionesEntry from "@/features/plataforma/organizaciones/entry";
import { AplicacionPlataformaRegistry } from "@/registry/types";

export const aplicacionPlataformaRegistry = {
  modulos: { component: ModulosAplicacionPlataforma },
  organizaciones: { component: OrganizacionesEntry },
} as const satisfies AplicacionPlataformaRegistry;
