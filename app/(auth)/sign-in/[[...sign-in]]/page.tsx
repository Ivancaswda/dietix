'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/app/context/useAuth";
import axios from 'axios'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import Image from "next/image";
import GoogleButton from "@/app/(auth)/GoogleButton";
import VkButton from "@/app/(auth)/VkButton";
function SignIn() {
    const { user, setUser } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await axios.post('/api/auth/sign-in', form)
            const data = res.data
            localStorage.setItem('token', data.token)

            const userRes = await fetch('/api/auth/user', {
                headers: { Authorization: `Bearer ${data.token}` },
            })
            if (!userRes.ok) throw new Error('Failed to fetch user')

            const userData = await userRes.json()
            setUser(userData.user)
            toast.success('Добро пожаловать обратно 👋')
            router.replace('/dashboard')
        } catch (err: any) {
            toast.error('Ошибка входа. Проверьте данные.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) router.replace('/dashboard')
    }, [user, router])
    const handleGoogleSignIn = async () => {

    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/50 px-4">
            <div className="grid w-full h-screen max-w-6xl overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-md dark:bg-zinc-900 md:grid-cols-2">


                <div className="relative hidden flex-col items-center justify-center bg-primary text-white md:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />

                    <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">
                        <Image
                            src="/logo.png"
                            alt="Dietix Logo"
                            width={160}
                            height={160}
                            className="rounded-3xl shadow-2xl"
                        />

                        <h1 className="text-4xl font-bold tracking-tight">
                            Диетикс
                        </h1>

                        <p className="max-w-sm text-sm text-white/80">
                            Умный помощник для создания персональной диеты и контроля питания с ИИ
                        </p>
                    </div>
                </div>


                <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="flex justify-center md:hidden mb-6">
                        <Image
                            src="/logo.png"
                            alt="Dietix Logo"
                            width={64}
                            height={64}
                            className="rounded-xl"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-primary/80 dark:text-primary">
                        Добро пожаловать в <span className="text-primary">Диетикс</span>
                    </h2>

                    <p className="mt-2 text-center text-sm text-gray-500">
                        Войдите в аккаунт, чтобы продолжить
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                        <LabelInputContainer>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </LabelInputContainer>

                        <LabelInputContainer>
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                        </LabelInputContainer>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative flex h-10 w-full items-center justify-center rounded-lg bg-primary text-white font-medium shadow-md transition hover:opacity-90 disabled:opacity-60"
                        >
                            {isLoading && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Войти →
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Нет аккаунта?{" "}
                        <Link href="/sign-up" className="text-primary hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>

                    <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <GoogleButton/>
                    {/* <VkButton/> */}

                </div>
            </div>
        </div>);
}


const SocialButton = ({icon, text, handleProvider}: {icon: React.ReactNode, text: string, handleProvider:any}) => (
    <button onClick={handleProvider}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-200"
            type="button"
    >
        {icon} {text}
    </button>
)

const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
)
export default SignIn