import { ComponentType } from "react";

export type AplicacionComponentProps = {
  organizacionId: string;
  proyectoId: string | null;
  aplicacionPath: string[];
};

export type AplicacionComponent = ComponentType<AplicacionComponentProps>;

export type AplicacionEntry = {
  component: AplicacionComponent;
};

export type AplicacionRegistry = Record<
  string,
  Record<string, AplicacionEntry>
>;

export type AplicacionPlataformaComponentProps = {
  aplicacionPlataformaPath: string[];
};

export type AplicacionPlataformaComponent =
  ComponentType<AplicacionPlataformaComponentProps>;

export type AplicacionPlataformaEntry = {
  component: AplicacionPlataformaComponent;
};

export type AplicacionPlataformaRegistry = Record<
  string,
  AplicacionPlataformaEntry
>;
