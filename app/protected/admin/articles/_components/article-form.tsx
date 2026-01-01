"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArticleType } from "@/hooks/use-articles";
import { createClient } from "@/lib/supabase/client";
import {
    Loader2,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface ArticleFormProps {
    initialData?: ArticleType | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function ArticleForm({ initialData, onSubmit, onCancel, isSubmitting }: ArticleFormProps) {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        thumbnail: "",
        content: "",
        excerpt: "",
        category_id: "",
        status: "draft",
        published_at: "",
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
    });
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                thumbnail: initialData.thumbnail || "",
                content: initialData.content || "",
                excerpt: initialData.excerpt || "",
                category_id: initialData.category_id || "",
                status: initialData.status || "draft",
                published_at: initialData.published_at ? initialData.published_at.slice(0, 16) : "",
                seo_title: initialData.seo_title || "",
                seo_description: initialData.seo_description || "",
                seo_keywords: initialData.seo_keywords || "",
            });
        }

        // Fetch categories for dropdown
        const fetchCategories = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("article_categories").select("id, name");
            if (data) setCategories(data);
        };
        fetchCategories();
    }, [initialData]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let thumbnailUrl = formData.thumbnail;

            if (thumbnailFile) {
                const supabase = createClient();
                const fileExt = thumbnailFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `thumbnails/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("articles")
                    .upload(filePath, thumbnailFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(filePath);
                thumbnailUrl = publicUrl;
            }
            onSubmit({ ...formData, thumbnail: thumbnailUrl });
        } catch (error) {
            console.error("Error uploading thumbnail:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category_id">Kategori</Label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>



            <div className="space-y-2">
                <Label htmlFor="excerpt">Kutipan (Excerpt)</Label>
                <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <TiptapEditor value={formData.content} onChange={handleContentChange} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="published_at">Tanggal Publikasi</Label>
                <Input id="published_at" name="published_at" type="datetime-local" value={formData.published_at} onChange={handleChange} />
            </div>

            <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-3">SEO Settings</h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input id="seo_title" name="seo_title" value={formData.seo_title} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seo_description">SEO Description</Label>
                        <Textarea id="seo_description" name="seo_description" value={formData.seo_description} onChange={handleChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seo_keywords">SEO Keywords</Label>
                        <Input id="seo_keywords" name="seo_keywords" value={formData.seo_keywords} onChange={handleChange} placeholder="keyword1, keyword2" />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="thumbnail">Gambar postingan</Label>
                <Input id="thumbnail" type="file" onChange={handleFileChange} accept="image/*" />
                {(previewUrl || formData.thumbnail) && (
                    <div className="mt-2">
                        <img src={previewUrl || formData.thumbnail} alt="Thumbnail Preview" className="h-40 w-auto object-cover rounded mb-2" />
                        <p className="text-sm text-muted-foreground">Selected: {thumbnailFile ? thumbnailFile.name : "Current Image"}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isUploading}>Batal</Button>
                <Button type="submit" disabled={isSubmitting || isUploading}>
                    {isSubmitting || isUploading ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </form>
    );
}

const TiptapEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none dark:prose-invert focus:outline-none [&_ol]:list-decimal [&_ul]:list-disc [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-bold [&_h4]:text-xl [&_h4]:font-bold [&_h5]:text-lg [&_h5]:font-bold [&_h6]:text-base [&_h6]:font-bold",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (!editor.isFocused) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 border rounded-md p-2">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 border-b pb-2 mb-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-muted" : ""}
                type="button"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-muted" : ""}
                type="button"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-muted" : ""}
                type="button"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-muted" : ""}
                type="button"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
                type="button"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                type="button"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
                type="button"
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive("heading", { level: 4 }) ? "bg-muted" : ""}
                type="button"
            >
                <Heading4 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive("heading", { level: 5 }) ? "bg-muted" : ""}
                type="button"
            >
                <Heading5 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive("heading", { level: 6 }) ? "bg-muted" : ""}
                type="button"
            >
                <Heading6 className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-muted" : ""}
                type="button"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-muted" : ""}
                type="button"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-muted" : ""}
                type="button"
            >
                <Quote className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                type="button"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                type="button"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
};