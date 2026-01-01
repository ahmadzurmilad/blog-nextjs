import { createClient } from "@/lib/supabase/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type PageProps = {
    params: {
        slug: string;
    };
};

// Generate metadata for the page (for SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();

    const { data: page } = await supabase
        .from("pages")
        .select("title, content, updated_at")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!page) {
        return {
            title: "Halaman Tidak Ditemukan",
        };
    }

    return {
        title: `${page.title} | MyBlog`,
    };
}

// The page component itself
export default async function PageDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = createClient();

    const { data: page, error } = await supabase.from("pages").select("title, content, updated_at").eq("slug", slug).eq("status", "published").single();

    if (error || !page) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <article>
                <header className="mb-8 border-b pb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{page.title}</h1>
                    {page.updated_at && (
                        <p className="text-muted-foreground text-sm">
                            Diperbarui pada {format(new Date(page.updated_at), "d MMMM yyyy", { locale: idLocale })}
                        </p>
                    )}
                </header>
                {/* Render HTML dari editor (TipTap) */}
                <div
                    className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mb-2 [&_h5]:text-base [&_h5]:font-bold [&_h5]:mb-1 [&_h6]:text-sm [&_h6]:font-bold [&_h6]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </article>
        </main>
    );
}