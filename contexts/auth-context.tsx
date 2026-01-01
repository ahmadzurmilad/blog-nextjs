"use client";
import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    role: string | null;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
