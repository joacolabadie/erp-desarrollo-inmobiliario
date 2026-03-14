import ModulosEntry from "@/features/plataforma/modulos/entry";
import { AplicacionPlataformaRegistry } from "@/registry/types";

export const aplicacionPlataformaRegistry = {
  modulos: { component: ModulosEntry },
} as const satisfies AplicacionPlataformaRegistry;
