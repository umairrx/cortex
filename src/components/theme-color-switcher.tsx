"use client";

import { Check, Palette } from "lucide-react";
import { useTheme } from "@/components/use-theme";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const THEME_GROUPS = [
  {
    label: "Essentials",
    themes: [
      {
        name: "Default",
        base: "default",
        color: "bg-zinc-900 dark:bg-zinc-100",
      },
      {
        name: "Mono",
        base: "mono",
        color: "bg-zinc-500",
      },
    ],
  },
  {
    label: "Professional",
    themes: [
      {
        name: "Supabase",
        base: "supabase",
        color: "bg-[#3ecf8e]",
      },
      {
        name: "Claude",
        base: "claude",
        color: "bg-[#d97757]",
      },
      {
        name: "Twitter",
        base: "twitter",
        color: "bg-[#1da1f2]",
      },
    ],
  },
  {
    label: "Vibrant",
    themes: [
      {
        name: "Amber",
        base: "amber",
        color: "bg-amber-500",
      },
      {
        name: "Candyland",
        base: "candyland",
        color: "bg-[#e91e63]",
      },
      {
        name: "Soft Pop",
        base: "soft-pop",
        color: "bg-[#ffb7b2]",
      },
    ],
  },
  {
    label: "Nature",
    themes: [
      {
        name: "Sage Garden",
        base: "sage-garden",
        color: "bg-[#8a9a5b]",
      },
      {
        name: "Caffeine",
        base: "caffeine",
        color: "bg-[#6f4e37]",
      },
    ],
  },
  {
    label: "Bold",
    themes: [
      {
        name: "Darkmatter",
        base: "darkmatter",
        color: "bg-[#1a1a1a]",
      },
      {
        name: "Neo Brutalism",
        base: "neo-brutalism",
        color: "bg-[#000000]",
      },
    ],
  },
];

export function ThemeColorSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getCurrentBase = (themeName: string | undefined) => {
    if (!themeName) return "default";
    if (themeName === "light" || themeName === "dark") return "default";
    if (themeName === "system") return "default";
    return themeName.endsWith("-dark") ? themeName.replace("-dark", "") : themeName;
  };

  const currentBase = getCurrentBase(theme);
  const isDark =
    typeof theme === "string" && (theme.endsWith("-dark") || theme === "dark")
    ? true
    : theme === "system"
    ? resolvedTheme === "dark"
    : false;

  const handleColorChange = (base: string) => {
    if (base === "default") {
      setTheme(isDark ? "dark" : "light");
    } else {
      setTheme(isDark ? `${base}-dark` : base);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <ScrollArea className="max-h-72">
        <DropdownMenuContent align="end">
          {THEME_GROUPS.map((group, index) => (
            <React.Fragment key={group.label}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {group.label}
              </DropdownMenuLabel>
              {group.themes.map((t) => (
                <DropdownMenuItem
                  key={t.name}
                  onClick={() => handleColorChange(t.base)}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded-full border", t.color)} />
                    <span>{t.name}</span>
                  </div>
                  {currentBase === t.base && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </ScrollArea>
    </DropdownMenu>
  );
}
