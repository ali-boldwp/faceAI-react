import React, { createContext, useContext, ReactNode } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
});

const apiFunctions = {

    getCurrentUser: async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    getFaceProfiles: async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/face-profiles", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },


    getFaceProfile: async (id: string) => {
        const token = localStorage.getItem("token");
        const res = await api.get(`/face-profiles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },


    deleteFaceProfile: async (id: string) => {
        const token = localStorage.getItem("token");
        const res = await api.delete(`/face-profiles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },


    createFaceProfile: async (data: any) => {
        const token = localStorage.getItem("token");
        const res = await api.post("/face-profiles", data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    analyzeFaceShape: async (frontImageUrl: string, sideImageUrl: string) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/face/shape`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ front_image_url: frontImageUrl, side_image_url: sideImageUrl }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data;
        } catch (err: any) {
            console.error("❌ Face shape API error:", err);
            throw err;
        }
    },

};

const MainContext = createContext<typeof apiFunctions | null>(null);

export const MainProvider = ({ children }: { children: ReactNode }) => (
    <MainContext.Provider value={apiFunctions}>{children}</MainContext.Provider>
);

export const useMainContext = () => {
    const context = useContext(MainContext);
    if (!context) throw new Error("useMainContext must be used within MainProvider");
    return context;
};
