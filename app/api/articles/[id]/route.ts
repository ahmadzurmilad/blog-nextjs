import { createClient } from "@/lib/supabase/server";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/lib/api/response";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) return unauthorizedResponse();

        const body = await request.json();
        const { title, slug, content, excerpt, category_id, status, published_at, seo_title, seo_description, seo_keywords, thumbnail } = body;

        const { data, error } = await supabase
            .from("articles")
            .update({
                title,
                slug,
                thumbnail,
                content,
                excerpt,
                category_id: category_id || null,
                status,
                published_at: published_at || null,
                seo_title,
                seo_description,
                seo_keywords,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return serverErrorResponse(error.message);
        }

        return successResponse(data);
    } catch (error: any) {
        return serverErrorResponse(error.message);
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) return unauthorizedResponse();

        // 1. Ambil data artikel sebelum dihapus untuk mendapatkan URL thumbnail
        const { data: article } = await supabase
            .from("articles")
            .select("thumbnail")
            .eq("id", id)
            .single();

        const { error } = await supabase.from("articles").delete().eq("id", id);

        if (error) return serverErrorResponse(error.message);

        // 2. Hapus gambar dari storage jika ada dan penghapusan DB berhasil
        if (article?.thumbnail) {
            // URL format: .../storage/v1/object/public/articles/thumbnails/filename.jpg
            const storageUrlPrefix = "/storage/v1/object/public/articles/";
            if (article.thumbnail.includes(storageUrlPrefix)) {
                const path = article.thumbnail.split(storageUrlPrefix)[1];
                if (path) {
                    await supabase.storage.from("articles").remove([path]);
                }
            }
        }

        return successResponse({ message: "Article deleted successfully" });
    } catch (error: any) {
        return serverErrorResponse(error.message);
    }
}