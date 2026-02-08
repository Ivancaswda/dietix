"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { FaBrain,  FaChartLine, FaUserCheck } from "react-icons/fa";
import {FaBowlFood} from "react-icons/fa6";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export function DietCards() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <section className="w-full  relative  py-24 " style={{backgroundColor: '#edffea'}}>
            <div className="absolute z-20 hidden lg:block  h-[500px] w-[500px] bg-primary blur-[140px] rounded-full bottom-40 -left-40" />
            <div className="absolute z-20 hidden lg:block  h-[400px] w-[400px] bg-primary blur-[140px] rounded-full top-4 right-10" />
            <h2 className="max-w-7xl pl-4 mx-auto text-3xl md:text-5xl font-bold text-center mb-16">
                Почему <span className="text-primary">Диетикс</span> — это удобно
            </h2>
            <div className='w-full flex items-center justify-center'>
                <Link href="/dashboard" >
                    <Button size='lg' className="px-6 py-6 cursor-pointer text-lg mx-auto hover:scale-105 transition-all" >
                        Начать сейчас
                    </Button>
                </Link>

            </div>


            <Carousel items={cards} />
        </section>
    );
}
const CardContent = ({
                         icon,
                         title,
                         text,
                     }: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) => {
    return (
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-lg space-y-6">
            <div className="text-primary text-4xl">{icon}</div>

            <h3 className="text-2xl font-semibold">{title}</h3>

            <p className="text-muted-foreground text-base leading-relaxed">
                {text}
            </p>
        </div>
    );
};
const data = [
    {
        category: "Персонализация",
        title: "Диета под тебя",
        src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        content: (
            <CardContent
                icon={<FaUserCheck />}
                title="Максимальная персонализация"
                text="ИИ учитывает твой возраст, вес, рост, цели и образ жизни, чтобы создать диету именно под тебя."
            />
        ),
    },
    {
        category: "Искусственный интеллект",
        title: "ИИ анализирует данные",
        src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
        content: (
            <CardContent
                icon={<FaBrain />}
                title="Умный алгоритм"
                text="Наш ИИ анализирует тысячи параметров и подбирает оптимальный план питания без догадок."
            />
        ),
    },
    {
        category: "Питание",
        title: "Просто и понятно",
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        content: (
            <CardContent
                icon={<FaBowlFood />}
                title="Без сложных меню"
                text="Никаких сложных рецептов — понятные блюда, которые легко готовить каждый день."
            />
        ),
    },
    {
        category: "Результат",
        title: "Видимый прогресс",
        src: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
        content: (
            <CardContent
                icon={<FaChartLine />}
                title="Контроль результата"
                text="Отслеживай калории, БЖУ и прогресс в одном удобном дашборде."
            />
        ),
    },
];