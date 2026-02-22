'use client'

import React, {useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOutIcon, UserIcon } from 'lucide-react'

import {useAuth} from "@/app/context/useAuth";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const Navbar = () => {
    const { user, logout, loading } = useAuth()
    const router = useRouter()

    return (
        <nav className="border-b bg-sidebar/50 max-w-screen overflow-x-hidden backdrop-blur-sm  sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4  flex items-center justify-between h-16">


                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Dietix" className='rounded-lg' width={48} height={48} />

                </Link>


                <div className="hidden sm:flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Рабочая панель
                    </Link>
                    <Link href="/voice" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Тикси AI
                    </Link>
                    <Link href="/call-history" className="text-sm text-muted-foreground hover:text-foreground transition">
                        История звонков
                    </Link>
                    <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Профиль
                    </Link>
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Цены
                    </Link>
                </div>



                <div className="flex items-center gap-4">

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:border-primary border-2 transition">
                                    <Avatar>

                                        <AvatarImage className='object-cover'  src={user.avatarUrl}  width={32}
                                                        height={32}/>
                                        <AvatarFallback className='bg-primary  text-white'>
                                            {user.userName[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.userName}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="hidden sm:flex items-center gap-2">
                                        <UserIcon size={16} /> Профиль
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <div className='sm:hidden'>
                                    <DropdownMenuItem>
                                        <Link href="/workspace" className="text-sm text-muted-foreground hover:text-foreground transition">
                                            Рабочая панель
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/voice" className="text-sm text-muted-foreground hover:text-foreground transition">
                                            Голосовой помощник
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/call-history" className="text-sm text-muted-foreground hover:text-foreground transition">
                                            История звонков
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition">
                                            Профиль
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                                            Цены
                                        </Link>
                                    </DropdownMenuItem>


                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => logout()}
                                    className="text-red-600 flex items-center gap-2"
                                >
                                    <LogOutIcon size={16} /> Выйти
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/sign-in">
                            <Button variant="outline">Войти</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
