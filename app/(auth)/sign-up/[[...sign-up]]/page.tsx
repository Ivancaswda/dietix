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
import { motion } from 'framer-motion'
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import GoogleButton from "@/app/(auth)/GoogleButton";
function SignUp() {
    const { user, setUser, loading } = useAuth()
    const router = useRouter()
    const [form, setForm] = useState({ userName: '', email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await axios.post('/api/auth/sign-up', form)
            const data = res.data
            localStorage.setItem('token', data.token)

            const userRes = await fetch('/api/auth/user', {
                headers: { Authorization: `Bearer ${data.token}` },
            })
            if (!userRes.ok) throw new Error('Failed to fetch user')

            const userData = await userRes.json()
            setUser(userData.user)
            toast.success('Добро пожаловать в Диетикс!')
            router.replace('/dashboard')
        } catch (err: any) {
            toast.error('Ошибка регистрации. Проверьте данные.')
        } finally {
            setIsLoading(false)
        }
    }
    const handleGoogleSignIn = async () => {

    }

    useEffect(() => {
        if (!loading && user) router.replace('/dashboard')
    }, [user, loading, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/50 px-4">
            <div className="grid w-full max-w-6xl h-screen overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-md dark:bg-zinc-900 md:grid-cols-2">


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
                            Создайте аккаунт и получите персонального AI-диетолога уже сегодня
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
                        Создать аккаунт в <span className="text-primary">Диетикс</span>
                    </h2>

                    <p className="mt-2 text-center text-sm text-gray-500">
                        Заполните форму, чтобы начать пользоваться AI-диетологом
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                        <LabelInputContainer>
                            <Label htmlFor="userName">Имя пользователя</Label>
                            <Input
                                id="userName"
                                type="text"
                                placeholder="Tyler"
                                value={form.userName}
                                onChange={(e) =>
                                    setForm({ ...form, userName: e.target.value })
                                }
                            />
                        </LabelInputContainer>

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

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="relative flex h-10 w-full items-center justify-center rounded-lg bg-primary text-white font-medium shadow-md transition hover:opacity-90 disabled:opacity-60"
                        >
                            {isLoading && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Создать аккаунт →
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Уже есть аккаунт?{" "}
                        <Link href="/sign-in" className="text-primary hover:underline">
                            Войти
                        </Link>
                    </p>

                    <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                    <GoogleButton/>
                </div>
            </div>
        </div>)
}


const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
)

export default SignUp
