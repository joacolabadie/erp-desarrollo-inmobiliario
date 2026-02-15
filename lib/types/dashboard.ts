export type Organizacion = {
  id: string;
  nombre: string;
};

export type Proyecto = {
  id: string;
  organizacionId: string;
  nombre: string;
};

export type AplicacionScope = "organizacional" | "proyecto" | "mixto";

export type Aplicacion = {
  id: string;
  slug: string;
  nombre: string;
  scope: AplicacionScope;
};

export type Modulo = {
  id: string;
  organizacionId: string;
  slug: string;
  nombre: string;
  aplicaciones: Aplicacion[];
};

export type AplicacionPlataforma = {
  id: string;
  slug: string;
  nombre: string;
};

export type User = {
  name: string;
  email: string;
};
