'use client'

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";

export default function PremiumSuccess() {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <div className='px-4'>
                <Image src='/hero2.png' width={220} height={220} alt='logo'/>
            </div>


            <h1 className="text-2xl font-semibold">Premium активирован 🎉</h1>
            <p className="text-muted-foreground mt-2">
                Спасибо за поддержку!
            </p>

            <Link href="/dashboard" className="mt-6 underline">
                <Button className="hover:scale-105 transition-all ">
                    Перейти на панель управления
                </Button>

            </Link>
        </div>
    );
}
