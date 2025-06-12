"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Proses callback dari OAuth
        const handleAuthCallback = async () => {
            const { error } = await supabase.auth.getSession();

            router.push("/");
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="flex justify-center items-center min-h-screen z-20">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-dark-blue dark:text-white">
                    Mengautentikasi...
                </h2>
                <p className="text-gray-navy dark:text-light-blue mt-2">
                    Mohon tunggu sebentar.
                </p>
            </div>
        </div>
    );
}