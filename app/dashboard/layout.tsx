"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import SidebarComponent from "@/components/Sidebar"
import { useAuth } from "@/app/context/useAuth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderOne } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({ children }) {
    const router = useRouter()
    const { user, loading } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/sign-up")
        }
    }, [user, loading, router])

    if (!user && loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <LoaderOne />
            </div>
        )
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex">

                {/* OVERLAY (mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
            fixed z-50 h-full w-[280px] bg-white border-r
            transform transition-transform duration-300
            md:static md:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
                >
                    <SidebarComponent onClose={() => setSidebarOpen(false)} />
                </aside>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col w-full">

                    {/* MOBILE HEADER */}
                    <div className="md:hidden flex items-center gap-2 p-3 border-b">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu />
                        </Button>
                        <span className="font-semibold">Диетикс</span>
                    </div>

                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
