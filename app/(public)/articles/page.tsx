import { createClient } from "@/lib/supabase/client";
import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Artikel | MyBlog",
  description: "Kumpulan artikel terbaru, tutorial, dan wawasan menarik.",
};

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  published_at: string | null;
  category: { name: string } | null;
}

export default async function ArticlesPage() {
  const supabase = createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select(`
            id,
            title,
            slug,
            excerpt,
            thumbnail,
            published_at,
            category:article_categories(name)
        `)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Artikel Terbaru</h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Temukan inspirasi dan pengetahuan baru melalui tulisan kami.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles?.map((article: any) => (
          <div key={article.id} className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <Link href={`/articles/${article.slug}`} className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={article.thumbnail || "/articles/default.jpg"}
                alt={article.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {article.published_at ? format(new Date(article.published_at), "d MMM yyyy", { locale: id }) : "-"}
                </span>
                {article.category?.name && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-primary">
                      {article.category.name}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                {article.excerpt || "Tidak ada ringkasan."}
              </p>
              <Button asChild variant="ghost" className="w-full justify-between group/btn mt-auto">
                <Link href={`/articles/${article.slug}`}>
                  Baca Selengkapnya
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {(!articles || articles.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          Belum ada artikel yang tersedia saat ini.
        </div>
      )}
    </div>
  );
}