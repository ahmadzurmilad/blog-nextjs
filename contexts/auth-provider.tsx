"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthContext } from "./auth-context";
import type { User } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        // 1. Cek user saat pertama kali load
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
                if (user) {
                    // Disini Anda bisa mengambil role dari tabel users atau metadata
                    // Contoh: setRole(user.user_metadata?.role || "user");
                    setRole("admin"); // Placeholder, sesuaikan dengan logika role Anda
                }
            } catch (error) {
                console.error("Error checking auth:", error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // 2. Listen perubahan auth (login/logout otomatis terdeteksi)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // Update role jika login
                setRole("admin");
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error: error?.message || null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
    };

    const refreshUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            // Opsional: Update role logic disini juga jika role bergantung pada metadata
        } catch (error) {
            console.error("Error refreshing user:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, role, signIn, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}