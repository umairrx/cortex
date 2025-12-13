import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface CollectionField {
	field_name: string;
	type: string;
	label: string;
}

interface Collection {
	id: string;
	name: string;
	singular: string;
	plural: string;
	type: "collection" | "single";
	fields: CollectionField[];
}

interface CollectionsContextType {
	collections: Collection[];
	addCollection: (collection: Collection) => void;
	deleteCollection: (id: string) => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(
	undefined,
);

export const useCollections = () => {
	const context = useContext(CollectionsContext);
	if (!context) {
		throw new Error("useCollections must be used within CollectionsProvider");
	}
	return context;
};

/**
 * Provider component that manages collections state and persists data to localStorage.
 * Provides methods to add and delete collections while keeping data synchronized.
 *
 * @param children - The child components to render within the provider
 * @returns The CollectionsContext provider wrapping the children
 */
export const CollectionsProvider = ({ children }: { children: ReactNode }) => {
	const [collections, setCollections] = useState<Collection[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem("collections");
		if (stored) {
			setCollections(JSON.parse(stored));
		}
	}, []);

	/**
	 * Adds or updates a collection in the state and localStorage.
	 * If a collection with the same ID exists, it will be replaced; otherwise it will be added.
	 *
	 * @param collection - The collection object to add or update
	 */
	const addCollection = (collection: Collection) => {
		const updated = [
			...collections.filter((c) => c.id !== collection.id),
			collection,
		];
		setCollections(updated);
		localStorage.setItem("collections", JSON.stringify(updated));
	};

	/**
	 * Deletes a collection from the state and localStorage by its ID.
	 *
	 * @param id - The unique identifier of the collection to delete
	 */
	const deleteCollection = (id: string) => {
		const updated = collections.filter((c) => c.id !== id);
		setCollections(updated);
		localStorage.setItem("collections", JSON.stringify(updated));
	};

	return (
		<CollectionsContext.Provider
			value={{ collections, addCollection, deleteCollection }}
		>
			{children}
		</CollectionsContext.Provider>
	);
};
