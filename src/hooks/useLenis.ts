import Lenis from "@studio-freight/lenis";
import { useCallback, useEffect, useRef } from "react";

export function useLenis() {
	const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
		});

		lenisRef.current = lenis;

		function frame(time: number) {
			lenis.raf(time);
			rafRef.current = requestAnimationFrame(frame);
		}

		rafRef.current = requestAnimationFrame(frame);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			if (lenisRef.current && typeof lenisRef.current.destroy === "function") {
				lenisRef.current.destroy();
			}
			lenisRef.current = null;
		};
	}, []);

	const scrollTo = useCallback(
		(
			target: number | string | HTMLElement,
			options?: Record<string, unknown>,
		) => {
			if (!lenisRef.current) return;

			if (typeof target === "string") {
				const el = document.querySelector(target) as HTMLElement | null;
				if (el) return lenisRef.current.scrollTo(el, options);
				const n = Number(target);
				if (!Number.isNaN(n)) return lenisRef.current.scrollTo(n, options);
				return;
			}

			if (typeof target === "number") {
				return lenisRef.current.scrollTo(target, options);
			}

			if (target instanceof HTMLElement) {
				return lenisRef.current.scrollTo(target, options);
			}

			return;
		},
		[],
	);

	return { scrollTo };
}

export default useLenis;
