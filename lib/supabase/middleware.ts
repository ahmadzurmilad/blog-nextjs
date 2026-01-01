import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Definisikan rute dan peran yang diizinkan
    const adminOnlyRoutes = ["/users", "/post", "/admin/pages", "users"];
    const protectedRoutes = ["/protected", "/dashboard", "/profiles", ...adminOnlyRoutes];
    const authRoutes = ["/auth/login", "/forgot-password"];
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
    const isAdminOnlyRoute = adminOnlyRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
    // 1. Jika pengguna tidak login dan mencoba mengakses rute yang dilindungi
    if (isProtectedRoute && !user) {
        const redirectUrl = new URL("/auth/login", request.url);
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // 2. Jika pengguna sudah login, periksa perannya untuk rute khusus admin
    if (user && isAdminOnlyRoute) {
        const userRole = user.app_metadata?.role;
        if (userRole !== 'admin') {
            // Alihkan ke halaman dashboard utama jika bukan admin
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // 3. Jika pengguna sudah login dan mencoba mengakses halaman login/register
    if (isAuthRoute && user) {
        const redirectTo = request.nextUrl.searchParams.get("redirectTo");
        if (redirectTo) {
            return NextResponse.redirect(new URL(redirectTo, request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return supabaseResponse;
}
