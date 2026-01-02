
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export type CategoryType = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: string | null;
    created_at?: string;
    parent?: {
        id: string;
        name: string;
    } | null;
};

export function useCategories() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = useCallback(async (search?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            const res = await fetch(`/api/categories?${params.toString()}`);

            const response = await res.json();

            if (!res.ok) {
                throw new Error(response.error || "Failed to fetch categories");
            }
            setCategories(response.data || []);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Gagal memuat kategori");
        } finally {
            setLoading(false);
        }
    }, []);

    const createCategory = async (data: Partial<CategoryType>) => {
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const response = await res.json();
            if (!res.ok) {
                throw new Error(response.error || "Gagal membuat kategori");
            }

            toast.success("Kategori berhasil dibuat");
            await fetchCategories();
        } catch (error: any) {
            toast.error(error.message);
            throw error;
        }
    };

    const updateCategory = async (id: string, data: Partial<CategoryType>) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const response = await res.json();
            if (!res.ok) {
                throw new Error(response.error || "Gagal memperbarui kategori");
            }

            toast.success("Kategori berhasil diperbarui");
            await fetchCategories();
        } catch (error: any) {
            toast.error(error.message);
            throw error;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            const response = await res.json();
            if (!res.ok) {
                throw new Error(response.error || "Gagal menghapus kategori");
            }

            toast.success("Kategori berhasil dihapus");
            await fetchCategories();
        } catch (error: any) {
            toast.error(error.message);
            throw error;
        }
    };

    return {
        categories,
        loading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}
