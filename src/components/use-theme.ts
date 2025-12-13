import { useContext } from "react";
import { ThemeProviderContext } from "./theme-context.ts";

/**
 * Custom hook to access the theme context and theme management functions.
 * Throws an error if used outside of a ThemeProvider.
 *
 * @returns The theme context value with current theme and setTheme function
 */
export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
