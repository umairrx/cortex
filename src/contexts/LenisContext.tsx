import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import useLenis from "../hooks/useLenis";

type LenisContextType = {
	scrollTo: (
		target: number | string | HTMLElement,
		options?: Record<string, unknown>,
	) => void;
};

const LenisContext = createContext<LenisContextType | undefined>(undefined);

export function LenisProvider({
	children,
}: PropsWithChildren<Record<string, unknown>>) {
	const { scrollTo } = useLenis();

	return (
		<LenisContext.Provider value={{ scrollTo }}>
			{children}
		</LenisContext.Provider>
	);
}

export function useLenisContext() {
	const ctx = useContext(LenisContext);
	if (!ctx)
		throw new Error("useLenisContext must be used within LenisProvider");
	return ctx;
}

export default LenisProvider;
