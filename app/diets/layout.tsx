"use client";

import React, {useEffect} from "react";
import DietBreadcrumbs from "@/app/diets/[dietId]/_components/DietBreadcrumbs";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/app/context/useAuth";
import {useRouter} from "next/navigation";

export default function DietLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const {user, loading} = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!user && !loading) {
            router.replace('/sign-up')
        }
    },[user, loading, router])
    return (
        <div className="space-y-6">
            {children}
        </div>
    );
}
