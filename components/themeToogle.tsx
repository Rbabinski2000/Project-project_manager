"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SwitchThumb } from "@radix-ui/react-switch";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;

  return (
    <Switch
  checked={current === "dark"}
  onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
  className="
    h-5 w-13 p-1                        /* big track */
    [&>span]:h-3 [&>span]:w-5            /* big thumb */
    transition-colors
    data-[state=checked]:bg-gray-800
    data-[state=unchecked]:bg-gray-200
  "
/>
  );
}