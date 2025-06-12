'use client'


import { useAuth } from "@/context/authContext";

export function isAuthenticated() {
    const { user, loading } = useAuth();
    return !loading && user !== null;

}
