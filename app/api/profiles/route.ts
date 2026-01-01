import { createClient } from "@/lib/supabase/server";
import { successResponse, serverErrorResponse, unauthorizedResponse } from "@/lib/api/response";

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return unauthorizedResponse();
        }

        const body = await request.json();
        const { first_name, last_name, phone, bio, avatar_url } = body;

        // 1. Ambil URL avatar lama sebelum diupdate
        const { data: oldProfile } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single();

        // 2. Update tabel 'profiles'. Trigger akan menyinkronkan ke 'auth.users'
        const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update({
                first_name,
                last_name,
                phone,
                bio,
                avatar_url,
            })
            .eq("id", user.id)
            .select()
            .single();

        if (updateError) {
            return serverErrorResponse(updateError.message);
        }

        // 3. Jika avatar berubah, hapus file lama dari storage
        const oldAvatarUrl = oldProfile?.avatar_url;
        if (oldAvatarUrl && oldAvatarUrl !== avatar_url) {
            // Asumsi bucket Anda bernama 'avatars'
            const storageUrlPrefix = `/storage/v1/object/public/avatars/`;
            if (oldAvatarUrl.includes(storageUrlPrefix)) {
                const path = oldAvatarUrl.split(storageUrlPrefix)[1];
                if (path) {
                    // Tidak perlu menunggu (await) agar response lebih cepat
                    supabase.storage.from("avatars").remove([path]);
                }
            }
        }

        return successResponse(updatedProfile);
    } catch (error: any) {
        return serverErrorResponse(error.message);
    }
}