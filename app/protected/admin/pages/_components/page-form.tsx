"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { PageType } from "@/hooks/use-pages";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";


const formSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    slug: z.string().min(1, "Slug wajib diisi"),
    content: z.string().min(1, "Konten wajib diisi"),
    // Ubah dari z.string().default("draft") menjadi:
    status: z.enum(["published", "draft", "archived"]),
});

type PageFormProps = {
    initialData?: PageType | null;
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
};

const EditorToolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="border-b p-2 flex flex-wrap gap-1 items-center bg-muted/20">
            <Button
                type="button"
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("underline") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className="h-8 w-8 p-0"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("strike") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className="h-8 w-8 p-0"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 4 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading4 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 5 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading5 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 6 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading6 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="h-8 w-8 p-0"
            >
                <Quote className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
};

export function PageForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}: PageFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            status: "draft",
        },
    });

    // 🔹 TipTap Editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: "",
        immediatelyRender: false, // 
        onUpdate: ({ editor }) => {
            form.setValue("content", editor.getHTML(), {
                shouldValidate: true,
            });
        },
    });

    // 🔹 Sync initial data → form + editor
    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                slug: initialData.slug,
                content: initialData.content,
                status: initialData.status as "published" | "draft" | "archived",
            });

            editor?.commands.setContent(initialData.content);
        } else {
            form.reset({
                title: "",
                slug: "",
                content: "",
                status: "published",
            });

            editor?.commands.clearContent();
        }
    }, [initialData, form, editor]);

    // 🔹 Auto slug
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue("title", title);

        if (!initialData) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");

            form.setValue("slug", slug);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Judul Halaman</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Contoh: Kebijakan Privasi"
                                    {...field}
                                    onChange={handleTitleChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Slug */}
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug (URL)</FormLabel>
                            <FormControl>
                                <Input placeholder="kebijakan-privasi" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Content (TipTap) */}
                <FormField
                    control={form.control}
                    name="content"
                    render={() => (
                        <FormItem>
                            <FormLabel>Konten</FormLabel>
                            <FormControl>
                                <div className="rounded-md border bg-background min-h-[260px] flex flex-col">
                                    <EditorToolbar editor={editor} />
                                    <div className="p-3 flex-1 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mb-2 [&_h5]:text-base [&_h5]:font-bold [&_h5]:mb-1 [&_h6]:text-sm [&_h6]:font-bold [&_h6]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4">
                                        <EditorContent editor={editor} />
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {initialData ? "Simpan Perubahan" : "Buat Halaman"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
