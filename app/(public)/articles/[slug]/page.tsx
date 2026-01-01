import { createClient } from "@/lib/supabase/client";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();

    const { data: article } = await supabase
        .from("articles")
        .select("title, excerpt, seo_title, seo_description")
        .eq("slug", slug)
        .single();

    if (!article) {
        return {
            title: "Artikel Tidak Ditemukan",
        };
    }

    return {
        title: article.seo_title || article.title,
        description: article.seo_description || article.excerpt,
    };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const supabase = createClient();

    // 1. Fetch Article Detail
    const { data: article, error } = await supabase
        .from("articles")
        .select(`
            id,
            title,
            slug,
            content,
            thumbnail,
            published_at,
            category_id,
            category:article_categories(name)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (error || !article) {
        notFound();
    }

    // 2. Fetch Related Articles (Same Category, Exclude Current)
    let relatedArticles: any[] = [];
    if (article.category_id) {
        const { data: related } = await supabase
            .from("articles")
            .select(`
                id,
                title,
                slug,
                thumbnail,
                published_at,
                excerpt,
                category:article_categories(name)
            `)
            .eq("category_id", article.category_id)
            .eq("status", "published")
            .neq("id", article.id)
            .order("published_at", { ascending: false })
            .limit(3);

        relatedArticles = related || [];
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            {/* Breadcrumb / Back Button */}
            <div className="mb-8">
                <Button asChild variant="ghost" className="pl-0 hover:pl-2 transition-all">
                    <Link href="/articles">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Artikel
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {article.category?.[0]?.name && (
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                    {article.category?.[0]?.name}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {article.published_at ? format(new Date(article.published_at), "d MMMM yyyy", { locale: idLocale }) : "-"}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                            {article.title}
                        </h1>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                        <img
                            src={article.thumbnail || "/articles/default.jpg"}
                            alt={article.title}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Content Body */}
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Sidebar / Related Articles */}
                <div className="space-y-8">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 sticky top-24">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Tag className="h-4 w-4" /> Artikel Terkait
                        </h3>

                        {relatedArticles.length > 0 ? (
                            <div className="space-y-6">
                                {relatedArticles.map((related: any) => (
                                    <div key={related.id} className="group flex flex-col gap-2">
                                        <Link href={`/articles/${related.slug}`} className="relative aspect-video overflow-hidden rounded-md bg-muted">
                                            <img
                                                src={related.thumbnail || "/articles/default.jpg"}
                                                alt={related.title}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </Link>
                                        <div className="space-y-1">
                                            <Link href={`/articles/${related.slug}`} className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {related.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                {related.published_at ? format(new Date(related.published_at), "d MMM yyyy", { locale: idLocale }) : "-"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada artikel terkait.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}