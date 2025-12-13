import { getAccessToken } from "@/lib/api";

export const getToken = (): string => {
	return getAccessToken() || "";
};
