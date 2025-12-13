import { useParams } from "react-router-dom";
import { useCollections } from "@/contexts/CollectionsContext";
import CollectionBuilds from "./CollectionBuilds";
import SingleCollectionBuilds from "./SingleCollectionBuilds";

/**
 * Wrapper component that routes to the appropriate collection management view.
 * Determines whether to show CollectionBuilds or SingleCollectionBuilds based on collection type.
 * Handles errors if the collection is not found.
 *
 * @returns The appropriate collection management component or error message
 */
const CollectionWrapper = () => {
	const { id } = useParams<{ id: string }>();
	const { collections } = useCollections();

	const collection = collections.find((c) => c.id === id);

	if (!collection) {
		return <div>Collection not found</div>;
	}

	if (collection.type === "single") {
		return <SingleCollectionBuilds />;
	}

	return <CollectionBuilds />;
};

export default CollectionWrapper;
