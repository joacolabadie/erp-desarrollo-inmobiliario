"use client";

import { Button } from "@/components/ui/button";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";

    setTheme(next);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="-mr-1">
      <HugeiconsIcon
        icon={Sun01Icon}
        strokeWidth={2}
        className="scale-100 dark:scale-0"
      />
      <HugeiconsIcon
        icon={Moon02Icon}
        strokeWidth={2}
        className="absolute scale-0 dark:scale-100"
      />
    </Button>
  );
}
