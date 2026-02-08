"use client";

import React from "react";
import DietBreadcrumbs from "@/app/diets/[dietId]/_components/DietBreadcrumbs";
import Navbar from "@/components/Navbar";

export default function DietLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-6">




            {children}
        </div>
    );
}
