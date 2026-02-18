"use client";

import type {
  BreadcrumbExtra,
  BreadcrumbExtraInput,
} from "@/components/breadcrumb-extras";
import { useBreadcrumbExtras } from "@/components/breadcrumb-extras";
import { useEffect, useMemo } from "react";

function makeKey(extra: BreadcrumbExtraInput) {
  return `${extra.label}::${extra.href ?? ""}`;
}

export function SetBreadcrumbExtras({
  extras,
}: {
  extras: BreadcrumbExtraInput[] | null;
}) {
  const { setExtras } = useBreadcrumbExtras();

  const normalized = useMemo<BreadcrumbExtra[]>(() => {
    return (extras ?? [])
      .filter(
        (extra) =>
          !!extra && typeof extra.label === "string" && extra.label.length > 0,
      )
      .map((extra, idx) => ({
        key: `${makeKey(extra)}::${idx}`,
        label: extra.label,
        href: extra.href ?? null,
      }));
  }, [extras]);

  useEffect(() => {
    setExtras(normalized);

    return () => setExtras([]);
  }, [normalized, setExtras]);

  return null;
}
