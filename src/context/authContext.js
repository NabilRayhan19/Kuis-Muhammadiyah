'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Periksa session dan setup auth listener
        const setupAuth = async () => {
            // Cek session yang ada
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                (_event, session) => {
                    setUser(session?.user || null);
                }
            );

            setLoading(false);

            return () => {
                subscription?.unsubscribe();
            };
        };

        setupAuth();
    }, []);

    // Sign in dengan email dan password
    const signIn = async ({ email, password }) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    };

    // Sign up dengan email dan password
    const signUp = async ({ email, password }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Signup error:", error.message);
            throw error;
        }
    };

    // Sign in dengan Google
    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Google sign-in error:", error.message);
            throw error;
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error("Sign out error:", error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signIn,
            signUp,
            signInWithGoogle,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook untuk mengakses context
export const useAuth = () => useContext(AuthContext);