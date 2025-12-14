import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../lib/api";

export interface Integration {
	_id: string;
	name: string;
	type: "mongodb" | "supabase" | "postgres";
	config: Record<string, unknown>;
	isActive: boolean;
	createdAt: string;
}

export function useIntegrations() {
	const queryClient = useQueryClient();

	const integrationsQuery = useQuery({
		queryKey: ["integrations"],
		queryFn: async () => {
			const response = await api.get("/integrations");
			return response.data as Integration[];
		},
	});

	const createIntegrationMutation = useMutation({
		mutationFn: async (
			data: Omit<Integration, "_id" | "createdAt" | "isActive" | "updatedAt">,
		) => {
			const response = await api.post("/integrations", data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["integrations"] });
			toast.success("Integration created successfully");
		},
		onError: (error) => {
			console.error("Failed to create integration:", error);
			toast.error("Failed to create integration");
		},
	});

	const deleteIntegrationMutation = useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/integrations/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["integrations"] });
			toast.success("Integration deleted");
		},
		onError: () => {
			toast.error("Failed to delete integration");
		},
	});

	const testConnectionMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await api.post("/integrations/test", { id });
			return response.data;
		},
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		},
		onError: () => {
			toast.error("Connection test failed");
		},
	});

	const introspectConnectionMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await api.post(`/integrations/${id}/introspect`);
			return response.data;
		},
		onError: () => {
			toast.error("Introspection failed");
		},
	});

	const getTableSchemaMutation = useMutation({
		mutationFn: async ({
			id,
			tableName,
		}: {
			id: string;
			tableName: string;
		}) => {
			const response = await api.get(`/integrations/${id}/schema/${tableName}`);
			return response.data;
		},
		onError: () => {
			toast.error("Failed to fetch table schema");
		},
	});

	return {
		integrations: integrationsQuery.data || [],
		isLoading: integrationsQuery.isLoading,
		createIntegration: createIntegrationMutation.mutateAsync,
		deleteIntegration: deleteIntegrationMutation.mutateAsync,
		testConnection: testConnectionMutation.mutateAsync,
		introspectConnection: introspectConnectionMutation.mutateAsync,
		getTableSchema: getTableSchemaMutation.mutateAsync,
		isCreating: createIntegrationMutation.isPending,
		isDeleting: deleteIntegrationMutation.isPending,
		isTesting: testConnectionMutation.isPending,
		isIntrospecting: introspectConnectionMutation.isPending,
		isFetchingSchema: getTableSchemaMutation.isPending,
	};
}
