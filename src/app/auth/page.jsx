"use client";

import dynamic from 'next/dynamic';

// Buat placeholder untuk loading
const LoadingPlaceholder = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
    </div>
);


// Import halaman auth secara dinamis dengan ssr: false
const AuthPageContent = dynamic(
    () => import('./auth-content'),
    {
        ssr: false,
        loading: () => <LoadingPlaceholder />
    }
);

export default function AuthPage() {
    return <AuthPageContent />;
}