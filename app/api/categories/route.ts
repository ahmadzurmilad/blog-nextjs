import { createClient } from "@/lib/supabase/server";
import { successResponse, badRequestResponse, serverErrorResponse, unauthorizedResponse } from "@/lib/api/response";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return unauthorizedResponse();

    let query = supabase
        .from("article_categories")
        .select("*, parent:parent_id(id, name)")
        .order("created_at", { ascending: false });

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        return serverErrorResponse(error.message);
    }

    return successResponse(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return unauthorizedResponse();

    const { name, slug, description, parent_id } = body;

    const { data, error } = await supabase
        .from("article_categories")
        .insert([{ name, slug, description, parent_id: parent_id || null }])
        .select()
        .single();

    if (error) {
        return serverErrorResponse(error.message);
    }

    return successResponse(data);
}
