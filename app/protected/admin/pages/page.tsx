"use client";

import { useEffect, useState } from "react";
import { usePages, PageType } from "@/hooks/use-pages";
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
import { PageForm } from "./_components/page-form";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function PagesManagement() {
    const { pages, loading, fetchPages, createPage, updatePage, deletePage } = usePages();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<PageType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPages(searchTerm);
    };

    const handleCreate = () => {
        setSelectedPage(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (page: PageType) => {
        setSelectedPage(page);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setPageToDelete(id);
    };

    const confirmDelete = async () => {
        if (pageToDelete) {
            await deletePage(pageToDelete);
            setPageToDelete(null);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedPage) {
                if (selectedPage.id) {
                    await updatePage(selectedPage.id, data);
                }
            } else {
                await createPage(data);
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
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Halaman</h1>
                    <p className="text-muted-foreground">
                        Kelola konten statis seperti Syarat & Ketentuan, Kebijakan Privasi, dll.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Halaman
                </Button>
            </div>

            <div className="flex items-center gap-2 bg-card p-4 rounded-lg shadow-sm border">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari halaman..."
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
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Terakhir Diupdate</TableHead>
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
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Belum ada halaman yang dibuat.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            {page.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-sm">
                                        /{page.slug}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={page.status === "published" ? "default" : "secondary"}>
                                            {page.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {page.updated_at
                                            ? format(new Date(page.updated_at), "d MMM yyyy, HH:mm", { locale: idLocale })
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
                                                <DropdownMenuItem onClick={() => handleEdit(page)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(page.id)}
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
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedPage ? "Edit Halaman" : "Buat Halaman Baru"}</DialogTitle>
                    </DialogHeader>
                    <PageForm
                        initialData={selectedPage}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Halaman ini akan dihapus secara permanen dari database.
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
