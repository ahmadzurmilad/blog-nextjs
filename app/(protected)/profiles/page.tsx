"use client";

import { useState } from "react";
import { ProfileForm } from "./_components/profile-form";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, loading, refreshUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/profiles', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Gagal memperbarui profil.");
            }

            toast.success("Profil berhasil diperbarui!", {
                description: "Perubahan Anda telah disimpan.",
            });

            // Panggil ini agar header dan data user di UI langsung berubah
            await refreshUser();

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error("Gagal Memperbarui", { description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !user) {
        return <div className="text-center p-8">Memuat profil...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
                    <p className="text-muted-foreground">
                        Kelola informasi pribadi dan pengaturan akun Anda.
                    </p>
                </div>

                <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border"><ProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} /></div>
            </div>
        </div>
    );
}