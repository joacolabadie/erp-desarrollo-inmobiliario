"use client";

import {
  useBreadcrumbExtras,
  type BreadcrumbExtra,
} from "@/components/breadcrumb-extras";
import { useEffect, useMemo } from "react";

export function SetBreadcrumbExtras({
  extras,
}: {
  extras: BreadcrumbExtra[] | null;
}) {
  const { setExtras } = useBreadcrumbExtras();

  const normalized = useMemo<BreadcrumbExtra[]>(() => {
    const list =
      (extras ?? [])
        .filter(
          (extra) =>
            !!extra && typeof extra.key === "string" && extra.key.length > 0,
        )
        .map((extra) => ({
          key: extra.key,
          label: extra.label ?? "",
          href: extra.href ?? null,
        })) ?? [];

    list.sort((a, b) => a.key.localeCompare(b.key));

    return list;
  }, [extras]);

  const signature = useMemo(() => {
    return normalized
      .map((e) => `${e.key}::${e.label}::${e.href ?? ""}`)
      .join("||");
  }, [normalized]);

  useEffect(() => {
    setExtras(normalized);

    return () => setExtras([]);
  }, [signature, setExtras, normalized]);

  return null;
}
