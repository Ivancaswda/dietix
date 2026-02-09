import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/app/context/AuthProvider";
import {Toaster} from "@/components/ui/sonner";
import {SidebarProvider} from "@/components/ui/sidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {DietsProvider} from "@/app/context/DietsContext";
import NavbarWrapper from "@/components/AuthWrapper";
import {GoogleOAuthProvider} from "@react-oauth/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Диетикс - Составляй диету с ИИ",
    description: "Создай свою эффективную диету при помощи ИИ.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DietsProvider>

        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!} >
            <AuthProvider>
                <html lang="ru">
                    <body>
                            <NavbarWrapper />

                                {children}

                        <Toaster />
                    </body>
                </html>
            </AuthProvider>
        </GoogleOAuthProvider>
        </DietsProvider>
    );
}
