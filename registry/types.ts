import { ComponentType } from "react";

export type ApplicationComponentProps = {
  organizationId: string;
  projectId: string | null;
};

export type ApplicationComponent = ComponentType<ApplicationComponentProps>;

export type ApplicationEntry = {
  component: ApplicationComponent;
};

export type ApplicationRegistry = Record<
  string,
  Record<string, ApplicationEntry>
>;

export type PlatformApplicationComponent = ComponentType;

export type PlatformApplicationEntry = {
  component: PlatformApplicationComponent;
};

export type PlatformAplicationRegistry = Record<
  string,
  PlatformApplicationEntry
>;
