import { createContext } from "react";

export type Theme = string;

export type ThemeProviderState = {
	theme: Theme;
	resolvedTheme: "dark" | "light";
	setTheme: (theme: Theme) => void;
};

export type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

const initialState: ThemeProviderState = {
	theme: "system",
	resolvedTheme: "light",
	setTheme: () => null,
};

export const ThemeProviderContext =
	createContext<ThemeProviderState>(initialState);
