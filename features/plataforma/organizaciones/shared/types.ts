import type {
  MiembroOrganizacionEstado,
  MiembroOrganizacionRol,
} from "@/lib/domain";

export type Organizacion = {
  id: string;
  nombre: string;
};

export type Modulo = {
  id: string;
  nombre: string;
};

export type Aplicacion = {
  id: string;
  nombre: string;
};

export type Miembro = {
  id: string;
  nombre: string;
  email: string;
  rol: MiembroOrganizacionRol;
  estado: MiembroOrganizacionEstado;
};
