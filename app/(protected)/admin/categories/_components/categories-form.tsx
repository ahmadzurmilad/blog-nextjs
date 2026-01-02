
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/hooks/use-categories";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
    initialData?: CategoryType | null;
    categories: CategoryType[]; // Pass all categories for parent selection
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function CategoryForm({
    initialData,
    categories,
    onSubmit,
    onCancel,
    isSubmitting,
}: CategoryFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [parentId, setParentId] = useState<string>(initialData?.parent_id || "none");

    // Auto-generate slug from name if not editing existing slug or if it's empty
    useEffect(() => {
        if (!initialData && name) {
            setSlug(name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/(^-|-$)/g, ""));
        }
    }, [name, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            slug,
            description,
            parent_id: parentId === "none" ? null : parentId,
        });
    };

    // Filter categories to prevent selecting self as parent
    const availableParents = categories.filter(c => c.id !== initialData?.id);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Teknologi"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="teknologi"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="parent">Kategori Induk (Opsional)</Label>
                <Select value={parentId} onValueChange={setParentId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori induk" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Tidak Ada</SelectItem>
                        {availableParents.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi singkat kategori..."
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Simpan Perubahan" : "Buat Kategori"}
                </Button>
            </div>
        </form>
    );
}
