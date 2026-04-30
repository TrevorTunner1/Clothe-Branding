import { create } from "zustand";
import axios from "axios";


const API_URL = '/api/v1/authentication';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
})


export const useAuthStore = create((set, get) => ({
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,   // true until initializeAuth completes — prevents flash of login page
    error: null,
    pendingVerification: false,
    verificationToken: null,
    profile: null,

    initializeAuth: async () => {
        set({ isInitializing: true });
        try {
            const res = await api.post(`${API_URL}/refresh`);
            set({
                isAuthenticated: true,
                user: res.data?.user || null, // ← store user if your backend returns it
            });
        } catch {
            set({ isAuthenticated: false });
        } finally {
            set({ isInitializing: false });
        }
    },

    signup: async (fullName, email, password) => {
        set({ isLoading: true, error: null })

        try {
            const res = await api.post(`${API_URL}/signup`, {
                fullName, email, password
            });

            set({
                user: { fullName, email },
                isLoading: false,
                pendingVerification: true,
                verificationToken: res.data.verificationToken,
            });

            return { success: true }

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Login failed. Please try again.';
            set({ error: msg, isLoading: false });
            return { success: false, message: msg };
        }
    },

    verifyOtp: async (otp) => {
        set({ isLoading: true, error: null })
        try {
            const verificationToken = get().verificationToken;
            await api.post(`${API_URL}/verify-email`, { otp }, { headers: { Authorization: `Bearer ${verificationToken}` } })
            set({
                isAuthenticated: true,
                isLoading: false,
                pendingVerification: false,
                verificationToken: null,
            });

            return { success: true };
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'OTP verification failed. Please try again.';
            set({ error: msg, isLoading: false });
            return { success: false, message: msg };
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await api.post(`${API_URL}/login`, { email, password });
            // backend sets both access + refresh token cookies on success

            set({ user: { email }, isAuthenticated: true, isLoading: false });
            return { success: true };
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Login failed. Please try again.';
            set({ error: msg, isLoading: false });
            return { success: false, message: msg };
        }
    },

    logout: async () => {
        try {
            await api.post(`${API_URL}/logout`);
            // backend clears both cookies
        } finally {
            set({ isAuthenticated: false }); // always clear state
        }
    },

    // ─── Silent refresh ───────────────────────────────────────
    // Called by the axios interceptor on 401 — not called manually
    refreshAccessToken: async () => {
        try {
            await api.post(`${API_URL}/refresh`);
            // backend sets a fresh access token cookie
            set({ isAuthenticated: true });
            return true;
        } catch {
            set({ isAuthenticated: false });
            return false;
        }
    },

    // add this inside your useAuthStore
    oauthCallback: async () => {
        set({ isInitializing: true });
        try {
            const res = await api.post(`${API_URL}/refresh`);
            set({
                isAuthenticated: true,
                isInitializing: false,
                user: res.data?.user || null,
            });
            return { success: true };
        } catch {
            set({ isAuthenticated: false, isInitializing: false });
            return { success: false };
        }
    },
}));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't retry the refresh endpoint itself — that causes infinite loops
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/refresh')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshed = await useAuthStore.getState().refreshAccessToken();
            isRefreshing = false;

            if (refreshed) {
                processQueue(null);
                return api(originalRequest); // retry original request
            } else {
                processQueue(new Error('Session expired'));
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);