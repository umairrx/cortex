import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge and conditionally join CSS class names.
 * Combines clsx for conditional classes and tailwind-merge for Tailwind CSS optimization.
 *
 * @param inputs - Variable number of class values to merge.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
