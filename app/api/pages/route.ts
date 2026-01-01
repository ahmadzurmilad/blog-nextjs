import { createClient } from "@/lib/supabase/server";
import { successResponse, badRequestResponse, serverErrorResponse, unauthorizedResponse } from "@/lib/api/response";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) return unauthorizedResponse();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        let query = supabase
            .from("pages")
            .select("*")
            .order("published_at", { ascending: false });

        if (search) {
            query = query.ilike("title", `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            return serverErrorResponse(error.message);
        }

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
        const { title, slug, content, status, published_at } = body;

        // Validasi sederhana
        if (!title || !slug || !content) {
            return badRequestResponse("Data tidak lengkap");
        }

        const { data, error } = await supabase
            .from("pages")
            .insert({
                title,
                slug,
                content,
                status: status || 'draft',
                published_at: published_at || null,
            })
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
