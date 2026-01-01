import { createClient } from "@/lib/supabase/server";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/lib/api/response";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("articles")
            .select("*, category:article_categories(id, name)")
            .order("created_at", { ascending: false });

        if (error) return serverErrorResponse(error.message);
        return successResponse(data);
    } catch (error: any) {
        return serverErrorResponse(error.message);
    }
}

export async function POST(request: Request) {
    try {
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
            .insert({
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
                author_id: user.id,
            })
            .select()
            .single();

        if (error) return serverErrorResponse(error.message);
        return successResponse(data);
    } catch (error: any) {
        return serverErrorResponse(error.message);
    }
}