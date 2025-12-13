import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Item {
	_id: string;
	collectionId: string;
	data: Record<string, string | number | boolean | string[] | null | undefined>;
	createdAt: string;
	updatedAt: string;
}

export const itemKeys = {
	all: (collectionId: string) => ["items", collectionId] as const,
	detail: (id: string) => ["items", "detail", id] as const,
};

/**
 * Hook to fetch all items for a specific collection.
 */
export const useItemsQuery = (
	collectionId: string,
	options?: { enabled?: boolean },
) => {
	return useQuery({
		queryKey: itemKeys.all(collectionId),
		queryFn: async (): Promise<Item[]> => {
			const response = await api.get(`/collections/${collectionId}/items`);
			return response.data;
		},
		enabled: !!collectionId && (options?.enabled ?? true),
	});
};

/**
 * Hook to fetch a single item by ID.
 */
export const useItemQuery = (id: string, options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: itemKeys.detail(id),
		queryFn: async (): Promise<Item> => {
			const response = await api.get(`/items/${id}`);
			return response.data;
		},
		enabled: !!id && (options?.enabled ?? true),
	});
};

/**
 * Hook to create a new item.
 */
export const useCreateItemMutation = (collectionId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Record<string, unknown>): Promise<Item> => {
			const response = await api.post(`/collections/${collectionId}/items`, {
				data,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemKeys.all(collectionId) });
		},
	});
};

/**
 * Hook to update an existing item.
 */
export const useUpdateItemMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: Record<string, unknown>;
		}): Promise<Item> => {
			const response = await api.put(`/items/${id}`, { data });
			return response.data;
		},
		onSuccess: (newItem) => {
			queryClient.invalidateQueries({
				queryKey: itemKeys.all(newItem.collectionId),
			});
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(newItem._id) });
		},
	});
};

/**
 * Hook to delete an item.
 */
export const useDeleteItemMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await api.delete(`/items/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
};
