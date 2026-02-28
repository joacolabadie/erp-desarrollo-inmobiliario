import type { AplicacionScope } from "@/lib/domain";

export type Modulo = {
  id: string;
  clave: string;
  slug: string;
  nombre: string;
};

export type Aplicacion = {
  id: string;
  clave: string;
  slug: string;
  nombre: string;
  scope: AplicacionScope;
};
