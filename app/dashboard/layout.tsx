"use client"
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import SidebarComponent from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {useAuth} from "@/app/context/useAuth";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {LoaderOne} from "@/components/ui/loader";
import {Button} from "@/components/ui/button";
import {Menu} from 'lucide-react'
import {DietsProvider} from "@/app/context/DietsContext";
export default function DashboardLayout({ children }) {
    const router = useRouter()
    const {user, loading} = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    useEffect(() => {
        if (!user && !loading) {
            router.replace('/sign-up')
        }

    }, [user, loading, router]);

    if (!user && loading) {
        return  <div className='flex h-screen w-screen items-center justify-center'>
            <LoaderOne/>
        </div>
    }
    return (


            <SidebarProvider>
                <div className="min-h-screen  overflow-x-hidden max-w-screen flex flex-col">
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

                    <div className="flex flex-1 w-screen relative">


                        <aside className="w-[280px] md:block hidden border-r fixed left-0 top-0 h-screen">

                            <SidebarComponent setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
                        </aside>


                        {sidebarOpen && (
                            <>

                                <div
                                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                                    onClick={() => setSidebarOpen(false)}
                                />

                                {/* Sidebar */}
                                <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-lg md:hidden">
                                    <SidebarComponent
                                        setSidebarOpen={setSidebarOpen}
                                        sidebarOpen={sidebarOpen}
                                    />
                                </div>
                            </>
                        )}

                        {/* Main content */}
                        <main className="flex-1 w-full overflow-y-auto md:ml-[280px]">
                            {children}
                        </main>
                    </div>



                </div>
            </SidebarProvider>

    )
}
