import { createClient } from "@/lib/supabase/server";
import { successResponse, badRequestResponse, notFoundResponse, serverErrorResponse, unauthorizedResponse } from "@/lib/api/response";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return unauthorizedResponse();
    const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error) {
        return serverErrorResponse(error.message);
    }

    return successResponse(data);
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) return unauthorizedResponse();
        const body = await request.json();

        const { data, error } = await supabase
            .from("pages")
            .update(body)
            .eq("id", params.id)
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

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const supabase = await createClient();
    const { error } = await supabase.from("pages").delete().eq("id", params.id);

    if (error) {
        return serverErrorResponse(error.message);
    }

    return successResponse(null, "Page deleted successfully");
}
