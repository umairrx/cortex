import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});

	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (originalRequest.url?.includes("/refresh")) {
			console.error("[API] Refresh endpoint failed. User must login again.");
			isRefreshing = false;
			processQueue(error);

			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => api(originalRequest))
					.catch((err) => Promise.reject(err));
			}

			console.warn(
				"[API] 401 Unauthorized detected. Attempting Auto-Refresh...",
			);
			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await api.post("/refresh");
				console.log(
					"[API] Auto-Refresh successful. Retrying original request.",
				);
				isRefreshing = false;
				processQueue();

				return api(originalRequest);
			} catch (err) {
				console.error("[API] Auto-Refresh failed. User must login again.", err);
				isRefreshing = false;
				processQueue(err);

				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);
