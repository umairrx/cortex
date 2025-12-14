import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Collection } from "@/types/types";

export const collectionKeys = {
	all: ["collections"] as const,
	detail: (id: string) => ["collections", id] as const,
};

/**
 * Hook to fetch all collections from the API.
 * @param options - Additional options for the query.
 * @returns Query object with collections data, loading state, and error state.
 */
export const useCollectionsQuery = (options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: collectionKeys.all,
		queryFn: async (): Promise<Collection[]> => {
			const response = await api.get("/collections");
			return response.data;
		},
		...options,
	});
};

/**
 * Hook to fetch a single collection by ID from the API.
 * @param id - The ID of the collection to fetch.
 * @returns Query object with collection data, loading state, and error state.
 */
export const useCollectionQuery = (id: string) => {
	return useQuery({
		queryKey: collectionKeys.detail(id),
		queryFn: async (): Promise<Collection> => {
			const response = await api.get(`/collections/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
};

/**
 * Hook to create a new collection via the API.
 * @returns Mutation object for creating collections.
 */
export const useCreateCollectionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			collection: Omit<Collection, "createdAt" | "updatedAt">,
		): Promise<Collection> => {
			const response = await api.post("/collections", collection);
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(
				collectionKeys.all,
				(oldData: Collection[] | undefined) => {
					return oldData ? [...oldData, data] : [data];
				},
			);

			queryClient.setQueryData(collectionKeys.detail(data.id), data);
		},
	});
};

/**
 * Hook to update an existing collection via the API.
 * @returns Mutation object for updating collections.
 */
export const useUpdateCollectionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			collection,
		}: {
			id: string;
			collection: Omit<Collection, "id" | "createdAt" | "updatedAt">;
		}): Promise<Collection> => {
			const response = await api.put(`/collections/${id}`, collection);
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(collectionKeys.detail(data.id), data);

			queryClient.setQueryData(
				collectionKeys.all,
				(oldData: Collection[] | undefined) => {
					return oldData
						? oldData.map((c) => (c.id === data.id ? data : c))
						: [data];
				},
			);

			queryClient.invalidateQueries({ queryKey: collectionKeys.all });
			queryClient.invalidateQueries({
				queryKey: collectionKeys.detail(data.id),
			});
		},
	});
};

/**
 * Hook to delete a collection via the API.
 * @returns Mutation object for deleting collections.
 */
export const useDeleteCollectionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await api.delete(`/collections/${id}`);
		},
		onSuccess: (_, id) => {
			queryClient.setQueryData(
				collectionKeys.all,
				(oldData: Collection[] | undefined) => {
					return oldData ? oldData.filter((c) => c.id !== id) : [];
				},
			);

			queryClient.removeQueries({ queryKey: collectionKeys.detail(id) });
		},
	});
};
