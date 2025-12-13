/**
 * Collection Name Validation & Normalization
 *
 * Enforces strict rules for collection naming derived from routing standards and API usage.
 * Ensures collection identifiers are stable, semantic, and resource-based.
 */

/**
 * Collection name validation and normalization result
 */
export interface CollectionNameValidationResult {
	isValid: boolean;
	singular: string;
	plural: string;
	displayName: string;
	errors: string[];
}

/**
 * Simple English pluralization rules
 * Maps singular nouns to their plural forms
 */
const PLURAL_RULES: Record<string, string> = {
	// Irregular plurals
	person: "people",
	man: "men",
	woman: "women",
	child: "children",
	foot: "feet",
	tooth: "teeth",
	goose: "geese",
	mouse: "mice",

	// Common irregular endings
	ox: "oxen",
	sheep: "sheep",
	deer: "deer",
	fish: "fish",
	moose: "moose",
	species: "species",
	series: "series",
};

/**
 * Converts a singular noun to its plural form using basic English rules
 *
 * @param singular - The singular form of the word
 * @returns The plural form of the word
 */
export const pluralize = (singular: string): string => {
	const lower = singular.toLowerCase();

	// Check irregular plurals first
	if (PLURAL_RULES[lower]) {
		return PLURAL_RULES[lower];
	}

	// Standard pluralization rules
	if (lower.endsWith("y")) {
		// category -> categories
		return `${lower.slice(0, -1)}ies`;
	}

	if (
		lower.endsWith("s") ||
		lower.endsWith("ss") ||
		lower.endsWith("x") ||
		lower.endsWith("z") ||
		lower.endsWith("ch") ||
		lower.endsWith("sh")
	) {
		// class -> classes, box -> boxes
		return `${lower}es`;
	}

	if (lower.endsWith("o")) {
		// hero -> heroes, photo -> photos
		const voiceless = ["photo", "piano", "halo"];
		if (voiceless.some((word) => lower.endsWith(word))) {
			return `${lower}s`;
		}
		return `${lower}es`;
	}

	if (lower.endsWith("f")) {
		// leaf -> leaves, belief -> beliefs
		return `${lower.slice(0, -1)}ves`;
	}

	if (lower.endsWith("fe")) {
		// life -> lives, wife -> wives
		return `${lower.slice(0, -2)}ves`;
	}

	// Default: just add 's'
	return `${lower}s`;
};

/**
 * Normalizes a user input string for use as a collection name identifier
 *
 * Conversion steps:
 * 1. Convert to lowercase
 * 2. Trim whitespace
 * 3. Replace spaces with hyphens
 * 4. Remove invalid characters (keep only a-z, 0-9, hyphens)
 * 5. Remove consecutive hyphens
 * 6. Remove leading/trailing hyphens
 *
 * @param input - The raw user input
 * @returns The normalized name
 */
export const normalizeCollectionName = (input: string): string => {
	return (
		input
			.toLowerCase()
			.trim()
			// Replace spaces with hyphens
			.replace(/\s+/g, "-")
			// Remove invalid characters (keep only a-z, 0-9, hyphens)
			.replace(/[^a-z0-9-]/g, "")
			// Remove consecutive hyphens
			.replace(/-+/g, "-")
			// Remove leading/trailing hyphens
			.replace(/^-+|-+$/g, "")
	);
};

/**
 * Validates a collection name against strict rules
 *
 * Rules (all applied to the normalized form):
 * - Must not be empty
 * - Must contain only lowercase letters (a-z), numbers (0-9), and hyphens
 * - Must start with a letter (not a number or hyphen)
 * - Must be between 2-50 characters
 * - Must be a single, semantic, resource-based noun (not plural, not actions, not hierarchical)
 * - Cannot contain uppercase letters, spaces, underscores, file extensions, or special characters
 *
 * @param normalized - The normalized collection name
 * @returns Object with validation result and error messages
 */
export const validateCollectionName = (
	normalized: string,
): { isValid: boolean; errors: string[] } => {
	const errors: string[] = [];

	if (!normalized || normalized.length === 0) {
		errors.push("Collection name cannot be empty");
		return { isValid: false, errors };
	}

	if (normalized.length < 2) {
		errors.push("Collection name must be at least 2 characters");
	}

	if (normalized.length > 50) {
		errors.push("Collection name must be at most 50 characters");
	}

	if (!/^[a-z][a-z0-9-]*$/.test(normalized)) {
		errors.push(
			"Collection name must start with a letter and contain only lowercase letters, numbers, and hyphens",
		);
	}

	if (normalized.startsWith("-") || normalized.endsWith("-")) {
		errors.push("Collection name cannot start or end with a hyphen");
	}

	if (normalized.includes("--")) {
		errors.push("Collection name cannot contain consecutive hyphens");
	}

	// Check for file extensions
	if (/\.(com|org|net|json|xml|txt|sql|api|db|api|rest)$/i.test(normalized)) {
		errors.push("Collection name cannot contain file extensions");
	}

	// Check for common action-based patterns (non-semantic)
	const actionPatterns =
		/^(get|post|put|delete|create|edit|update|delete|remove|add|fetch|list|show|view|manage|build|make|set|do|run|execute|process|handle|perform|action|method|call|send|receive|export|import|download|upload|submit|process|validate|generate)/i;
	if (actionPatterns.test(normalized)) {
		errors.push(
			"Collection name should be a semantic, resource-based noun, not an action or verb",
		);
	}

	// Check for deep/hierarchical paths
	if (normalized.includes("/") || normalized.includes("\\")) {
		errors.push(
			"Collection name cannot contain path separators or hierarchical structures",
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Complete validation and normalization pipeline
 *
 * Takes raw user input and returns:
 * - Validated singular form (for API/database use)
 * - Generated plural form (for collection routes)
 * - Display name (for UI)
 * - Any validation errors
 *
 * @param userInput - Raw input from user
 * @returns Complete validation result with singular, plural, and display names
 */
export const validateAndNormalizeCollectionName = (
	userInput: string,
): CollectionNameValidationResult => {
	const normalized = normalizeCollectionName(userInput);
	const validation = validateCollectionName(normalized);

	const singular = normalized;
	const plural = validation.isValid ? pluralize(singular) : "";

	// Create display name: convert hyphens back to spaces and capitalize
	const displayName = singular
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return {
		isValid: validation.isValid,
		singular,
		plural,
		displayName,
		errors: validation.errors,
	};
};

/**
 * Generates API routes from a collection name
 *
 * @param singular - The singular collection name
 * @param plural - The plural collection name
 * @returns Object with generated routes
 */
export const generateCollectionRoutes = (singular: string, plural: string) => {
	return {
		singularRoute: `/${singular}/:id`,
		pluralRoute: `/${plural}`,
		createRoute: `/${plural}/new`,
	};
};
