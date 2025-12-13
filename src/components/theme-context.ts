import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

export const ThemeProviderContext =
	createContext<ThemeProviderState>(initialState);
