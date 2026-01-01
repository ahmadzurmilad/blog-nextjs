"use client";

import { useEffect, useState } from "react";
import { useArticles, ArticleType } from "@/hooks/use-articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreVertical, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { ArticleForm } from "./_components/article-form";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function ArticlesManagement() {
    const { articles, loading, fetchArticles, createArticle, updateArticle, deleteArticle } = useArticles();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchArticles(searchTerm);
    };

    const handleCreate = () => {
        setSelectedArticle(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (article: ArticleType) => {
        setSelectedArticle(article);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setArticleToDelete(id);
    };

    const confirmDelete = async () => {
        if (articleToDelete) {
            try {
                await deleteArticle(articleToDelete);
            } catch (error) {
                console.error(error);
            } finally {
                setArticleToDelete(null);
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedArticle) {
                await updateArticle(selectedArticle.id, data);
            } else {
                await createArticle(data);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Artikel</h1>
                    <p className="text-muted-foreground">
                        Kelola artikel blog, berita, dan konten dinamis lainnya.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Artikel
                </Button>
            </div>

            <div className="flex items-center gap-2 bg-card p-4 rounded-lg shadow-sm border">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari artikel..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">Cari</Button>
                </form>
            </div>

            <div className="bg-card rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Belum ada artikel yang dibuat.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                {article.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-6">/{article.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{article.category?.name || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={article.status === "published" ? "default" : "secondary"}>
                                            {article.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {article.created_at
                                            ? format(new Date(article.created_at), "d MMM yyyy", { locale: idLocale })
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(article)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedArticle ? "Edit Artikel" : "Buat Artikel Baru"}</DialogTitle>
                    </DialogHeader>
                    <ArticleForm
                        initialData={selectedArticle}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!articleToDelete} onOpenChange={(open) => !open && setArticleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Artikel ini akan dihapus secara permanen dari database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}