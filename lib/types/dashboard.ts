export type Organization = {
  id: string;
  nombre: string;
};

export type Project = {
  id: string;
  organizacionId: string;
  nombre: string;
};

export type ApplicationScope = "organizacional" | "proyecto" | "mixto";

export type Application = {
  id: string;
  slug: string;
  nombre: string;
  scope: ApplicationScope;
};

export type Module = {
  id: string;
  organizacionId: string;
  slug: string;
  nombre: string;
  aplicaciones: Application[];
};

export type PlatformApplication = {
  id: string;
  slug: string;
  nombre: string;
};

export type User = {
  name: string;
  email: string;
};
