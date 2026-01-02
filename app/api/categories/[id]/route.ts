import { createClient } from "@/lib/supabase/server";
import { successResponse, serverErrorResponse } from "@/lib/api/response";

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const supabase = await createClient();

    const { name, slug, description, parent_id } = body;

    const { data, error } = await supabase
        .from("article_categories")
        .update({ name, slug, description, parent_id: parent_id || null })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return serverErrorResponse(error.message);
    }

    return successResponse(data);
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const supabase = await createClient();

    const { error } = await supabase
        .from("article_categories")
        .delete()
        .eq("id", id);

    if (error) {
        return serverErrorResponse(error.message);
    }

    return successResponse({ message: "Category deleted successfully" });
}
