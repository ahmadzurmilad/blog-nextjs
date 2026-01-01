"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export type PageType = {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export function usePages() {
    const [pages, setPages] = useState<PageType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPages = useCallback(async (search?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);

            const response = await fetch(`/api/pages?${params.toString()}`);
            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            setPages(result.data || []);
        } catch (error: any) {
            toast.error(error.message || "Gagal memuat halaman");
        } finally {
            setLoading(false);
        }
    }, []);

    const createPage = async (data: Partial<PageType>) => {
        try {
            const response = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            toast.success("Halaman berhasil dibuat");
            fetchPages();
            return result.data;
        } catch (error: any) {
            toast.error(error.message || "Gagal membuat halaman");
            throw error;
        }
    };

    const updatePage = async (id: string, data: Partial<PageType>) => {
        if (!id) return;
        try {
            const response = await fetch(`/api/pages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            toast.success("Halaman berhasil diperbarui");
            fetchPages();
            return result.data;
        } catch (error: any) {
            toast.error(error.message || "Gagal memperbarui halaman");
            throw error;
        }
    };

    const deletePage = async (id: string) => {
        try {
            const response = await fetch(`/api/pages/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            toast.success("Halaman berhasil dihapus");
            setPages((prev) => prev.filter((p) => p.id !== id));
        } catch (error: any) {
            toast.error(error.message || "Gagal menghapus halaman");
        }
    };

    return {
        pages,
        loading,
        fetchPages,
        createPage,
        updatePage,
        deletePage,
    };
}
