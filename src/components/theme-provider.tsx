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

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
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
