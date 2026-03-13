"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type BreadcrumbExtraInput = {
  label: string;
  href?: string;
};

export type BreadcrumbExtra = {
  key: string;
  label: string;
  href: string | null;
};

type BreadcrumbExtrasContextValue = {
  extras: BreadcrumbExtra[];
  setExtras: Dispatch<SetStateAction<BreadcrumbExtra[]>>;
};

const BreadcrumbExtrasContext = createContext<
  BreadcrumbExtrasContextValue | undefined
>(undefined);

export function BreadcrumbExtrasProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [extras, setExtras] = useState<BreadcrumbExtra[]>([]);

  const value = useMemo(() => ({ extras, setExtras }), [extras, setExtras]);

  return (
    <BreadcrumbExtrasContext.Provider value={value}>
      {children}
    </BreadcrumbExtrasContext.Provider>
  );
}

export function useBreadcrumbExtras() {
  const ctx = useContext(BreadcrumbExtrasContext);

  if (!ctx) {
    throw new Error(
      "useBreadcrumbExtras must be used within BreadcrumbExtrasProvider",
    );
  }

  return ctx;
}
