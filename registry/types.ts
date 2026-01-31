import { ComponentType } from "react";

export type ApplicationComponentProps = {
  organizationId: string;
  projectId: string | null;
  applicationPath: string[];
};

export type ApplicationComponent = ComponentType<ApplicationComponentProps>;

export type ApplicationEntry = {
  component: ApplicationComponent;
};

export type ApplicationRegistry = Record<
  string,
  Record<string, ApplicationEntry>
>;

export type PlatformApplicationComponentProps = {
  platformApplicationPath: string[];
};

export type PlatformApplicationComponent =
  ComponentType<PlatformApplicationComponentProps>;

export type PlatformApplicationEntry = {
  component: PlatformApplicationComponent;
};

export type PlatformAplicationRegistry = Record<
  string,
  PlatformApplicationEntry
>;
