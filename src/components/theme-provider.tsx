import { useEffect, useState } from "react";
import type { Theme, ThemeProviderProps } from "./theme-context.ts";
import { ThemeProviderContext } from "./theme-context.ts";

/**
 * Theme provider component that manages application theme state.
 * Handles light, dark, and system theme modes with localStorage persistence.
 * Updates the document root element with appropriate theme classes.
 *
 * @param children - The child components to wrap with theme provider
 * @param defaultTheme - The default theme to use (defaults to "system")
 * @param storageKey - The localStorage key for persisting theme preference
 * @param props - Additional component props
 * @returns The theme provider wrapping the children with context
 */
export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);
	const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

	useEffect(() => {
		const root = window.document.documentElement;

		if (theme === "system") {
			const isSystemDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			const systemTheme = isSystemDark ? "dark" : "light";
			root.setAttribute("data-theme", systemTheme);

			root.classList.remove("light", "dark");
			root.classList.add(systemTheme);
			setResolvedTheme(systemTheme);
			return;
		}

		root.setAttribute("data-theme", theme);
		root.classList.remove("light", "dark");
		if (theme.endsWith("-dark") || theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.add("light");
		}

		if (theme.endsWith("-dark") || theme === "dark") {
			setResolvedTheme("dark");
		} else {
			setResolvedTheme("light");
		}
	}, [theme]);

	const value = {
		theme,
		resolvedTheme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}
