
export default async function AdminPage() {
    /*const supabase = await createClient()
    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
      redirect('/auth/login')
    }*/

    return (
        <div className="flex h-svh w-full items-center justify-center gap-2">
            <p>
                {/*Hello <span>{data.claims.email}</span>*/}
                <span>Hello Admin</span>
            </p>

        </div>
    )
}
