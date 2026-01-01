import { useState, useCallback } from "react";
import { toast } from "sonner";
export type ArticleType = {
    id: string;
    author_id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    content: string;
    excerpt?: string;
    status: string;
    category_id?: string;
    category?: { id: string; name: string };
    published_at?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    created_at: string;
    updated_at: string;
};

export function useArticles() {
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = useCallback(async (search?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);

            const res = await fetch(`/api/articles?${params.toString()}`);
            const result = await res.json();

            if (result.success) {
                setArticles(result.data);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Gagal mengambil data artikel");
        } finally {
            setLoading(false);
        }
    }, []);

    const createArticle = async (data: Partial<ArticleType>) => {
        const res = await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) {
            toast.error(result.message || "Gagal membuat artikel");
            throw new Error(result.message);
        }
        toast.success("Artikel berhasil dibuat");
        await fetchArticles();
        return result.data;
    };

    const updateArticle = async (id: string, data: Partial<ArticleType>) => {
        const res = await fetch(`/api/articles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) {
            toast.error(result.message || "Gagal memperbarui artikel");
            throw new Error(result.message);
        }
        toast.success("Artikel berhasil diperbarui");
        await fetchArticles();
        return result.data;
    };

    const deleteArticle = async (id: string) => {
        const res = await fetch(`/api/articles/${id}`, {
            method: "DELETE",
        });
        const result = await res.json();
        if (!result.success) {
            toast.error(result.message || "Gagal menghapus artikel");
            throw new Error(result.message);
        }
        toast.success("Artikel berhasil dihapus");
        await fetchArticles();
        return result.data;
    };

    return { articles, loading, error, fetchArticles, createArticle, updateArticle, deleteArticle };
}