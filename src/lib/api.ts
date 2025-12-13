import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: {
	resolve: (value: unknown) => void;
	reject: (reason?: Error | unknown) => void;
}[] = [];

const processQueue = (error: Error | unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
	accessToken = token;
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const response = await api.post("/refresh");
				const { accessToken: newAccessToken } = response.data;

				setAccessToken(newAccessToken);
				api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				processQueue(null, newAccessToken);
				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				setAccessToken(null);

				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
