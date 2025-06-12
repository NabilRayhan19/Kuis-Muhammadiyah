'use client'


import { useAuth } from "@/context/authContext";

export function IsAuthenticated() {
    const { user, loading } = useAuth();
    return !loading && user !== null;

}
