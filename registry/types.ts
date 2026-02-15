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

export type PlataformaAplicacionComponentProps = {
  plataformaAplicacionPath: string[];
};

export type PlataformaAplicacionComponent =
  ComponentType<PlataformaAplicacionComponentProps>;

export type PlataformaAplicacionEntry = {
  component: PlataformaAplicacionComponent;
};

export type PlataformaAplicacionRegistry = Record<
  string,
  PlataformaAplicacionEntry
>;
