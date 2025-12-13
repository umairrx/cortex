import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current screen size is mobile.
 * Returns true if the window width is less than the mobile breakpoint.
 *
 * @returns A boolean indicating if the device is mobile.
 */
export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}
