"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const HIDDEN_ROUTES = ["/sign-in", "/sign-up"];

export default function NavbarWrapper() {
    const pathname = usePathname();

    if (HIDDEN_ROUTES.includes(pathname)) {
        return null;
    }

    return <Navbar />;
}
