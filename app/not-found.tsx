'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <Link href={'/'} >
                <Image src={'/logo.png'} width={120} height={120} className='w-[120px] rounded-2xl mb-6 h-[120px]' alt='logo' />
            </Link>

            <h1 className="text-4xl font-bold mb-4">
                Страница не найдена
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md">
                Похоже, вы ввели неверный адрес или страница была удалена.
                Но не переживайте — вернёмся на главную.
            </p>

            <Button size="lg">
                <Link href="/">
                    Вернуться на главную
                </Link>
            </Button>
        </div>
    )
}
