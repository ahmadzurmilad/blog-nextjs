import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center px-4 md:px-6">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                        Selamat Datang di MyBlog
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        Platform berbagi cerita, pengetahuan, dan inspirasi. Temukan artikel menarik atau mulai tulis ceritamu sendiri hari ini.
                    </p>
                    <div className="flex gap-4">
                        <Button asChild size="lg">
                            <Link href="/articles">Mulai Membaca</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/auth/login">Bergabung</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto space-y-6 bg-muted/50 py-8 md:py-12 lg:py-24 rounded-3xl my-8 px-4 md:px-6">
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <BookOpen className="h-12 w-12 text-primary" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Artikel Berkualitas</h3>
                                <p className="text-sm text-muted-foreground">
                                    Akses ribuan artikel dari berbagai kategori yang dikurasi dengan baik.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Users className="h-12 w-12 text-primary" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Komunitas</h3>
                                <p className="text-sm text-muted-foreground">
                                    Bergabung dengan komunitas penulis dan pembaca yang suportif.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Zap className="h-12 w-12 text-primary" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Cepat & Modern</h3>
                                <p className="text-sm text-muted-foreground">
                                    Dibangun dengan teknologi web terbaru untuk pengalaman terbaik.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Articles Dummy */}
            <section className="container mx-auto py-8 md:py-12 lg:py-24 px-4 md:px-6">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                    <h2 className="text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold tracking-tighter">
                        Artikel Terbaru
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Tulisan terbaru dari komunitas kami.
                    </p>
                </div>
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3 mt-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group relative flex flex-col space-y-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="aspect-video rounded-md bg-muted w-full mb-2 flex items-center justify-center text-muted-foreground">
                                Thumbnail {i}
                            </div>
                            <h3 className="text-xl font-bold">Judul Artikel Dummy {i}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <Link href="#" className="absolute inset-0"><span className="sr-only">View Article</span></Link>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Button asChild variant="ghost">
                        <Link href="/articles" className="flex items-center">Lihat Semua Artikel <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}