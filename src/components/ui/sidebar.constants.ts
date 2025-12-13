export const SIDEBAR_COOKIE_NAME = "sidebar_state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export function setCookie(
	name: string,
	value: string | boolean,
	maxAge: number,
) {
	// biome-ignore lint/suspicious/noDocumentCookie: false positive
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}; path=/; max-age=${maxAge}`;
}
