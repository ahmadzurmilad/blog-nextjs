"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User as UserIcon } from "lucide-react";
import { sha256 } from "js-sha256";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { countryCodes, defaultCountry } from "@/lib/phone/country-codes";
import { isValidPhoneNumber } from "@/lib/phone/validate-phone";

interface ProfileFormProps {
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
}

const profileSchema = z.object({
    first_name: z.string().min(1, "Nama depan wajib diisi"),
    last_name: z.string().optional(),
    country_code: z.string(),
    phone_number: z.string().optional(),
    bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
    avatar_url: z.string().optional(),
}).refine((data) => {
    if (!data.phone_number) return true;
    return isValidPhoneNumber(data.phone_number, data.country_code);
}, {
    message: "Nomor telepon tidak valid",
    path: ["phone_number"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ onSubmit, isSubmitting }: ProfileFormProps) {
    const { user } = useAuth();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            country_code: defaultCountry.dialCode,
            phone_number: "",
            bio: "",
            avatar_url: "",
        },
    });

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = form;

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user?.user_metadata) {
            const phone = user.user_metadata.phone || "";
            let countryCode = defaultCountry.dialCode;
            let phoneNumber = phone;

            // Coba cocokkan nomor telepon yang ada dengan kode negara
            const sortedCodes = [...countryCodes].sort((a, b) => b.dialCode.length - a.dialCode.length);
            const matched = sortedCodes.find(c => phone.startsWith(c.dialCode));
            if (matched) {
                countryCode = matched.dialCode;
                phoneNumber = phone.slice(matched.dialCode.length);
            }

            reset({
                first_name: user.user_metadata.first_name || "",
                last_name: user.user_metadata.last_name || "",
                country_code: countryCode,
                phone_number: phoneNumber,
                bio: user.user_metadata.bio || "",
                avatar_url: user.user_metadata.avatar_url || "",
            });
        }
    }, [user, reset]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const getGravatarURL = (email: string) => {
        // 1. Trim whitespace dan ubah ke lowercase
        const address = String(email).trim().toLowerCase();
        // 2. Buat hash SHA256
        const hash = sha256(address);
        // 3. Kembalikan URL Gravatar dengan parameter default
        return `https://gravatar.com/avatar/${hash}?s=400&d=robohash&r=x`;
    };

    const handleUseGravatar = () => {
        if (user?.email) {
            const gravatarUrl = getGravatarURL(user.email);
            setValue("avatar_url", gravatarUrl, { shouldDirty: true });
            setPreviewUrl(gravatarUrl);
            setAvatarFile(null); // Batalkan file yang mungkin sudah dipilih untuk di-upload
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmitHandler = async (data: ProfileFormValues) => {
        let finalAvatarUrl = data.avatar_url;

        if (avatarFile) {
            setIsUploading(true);
            try {
                const supabase = createClient();
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

                const { error } = await supabase.storage.from("avatars").upload(fileName, avatarFile, { upsert: true });
                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
                finalAvatarUrl = publicUrl;
            } catch (error) {
                console.error("Error uploading avatar:", error);
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        // Normalisasi nomor telepon: hapus angka 0 di awal jika ada
        let cleanPhoneNumber = data.phone_number || "";
        if (cleanPhoneNumber.startsWith("0")) {
            cleanPhoneNumber = cleanPhoneNumber.slice(1);
        }

        const finalData = {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.country_code + cleanPhoneNumber,
            bio: data.bio,
            avatar_url: finalAvatarUrl,
        };

        await onSubmit(finalData);
    };

    const currentAvatar = previewUrl || watch("avatar_url");
    const loading = isSubmitting || isUploading;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
                        <Label>Avatar</Label>
                        <div className="relative h-32 w-32">
                            {currentAvatar ? (
                                <img src={currentAvatar} alt="Avatar" className="h-full w-full rounded-full object-cover border-2" />
                            ) : (
                                <div className="h-full w-full rounded-full bg-muted flex items-center justify-center border-2">
                                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Input id="avatar" type="file" onChange={handleFileChange} accept="image/*" className="text-sm file:mr-2 file:text-xs" />
                            <Button type="button" variant="secondary" onClick={handleUseGravatar} className="text-xs">Gunakan Gravatar</Button>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Nama Depan</Label>
                                <Input id="first_name" {...register("first_name")} />
                                {errors.first_name && <p className="text-sm text-red-500">{errors.first_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Nama Belakang</Label>
                                <Input id="last_name" {...register("last_name")} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telepon</Label>
                            <div className="flex gap-2">
                                <select
                                    className="flex h-10 w-[120px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("country_code")}
                                >
                                    {countryCodes.map((c) => (
                                        <option key={c.code} value={c.dialCode}>{c.flag} +{c.dialCode}</option>
                                    ))}
                                </select>
                                <Input id="phone" type="tel" {...register("phone_number")} className="flex-1" />
                            </div>
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" {...register("bio")} rows={3} placeholder="Ceritakan sedikit tentang diri Anda" />
                            {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t"><Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{loading ? "Menyimpan..." : "Simpan Perubahan"}</Button></div>
            </form>
        </FormProvider>
    );
}