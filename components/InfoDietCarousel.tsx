
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import React from "react";

export function InfoDietCarousel() {
    const features = [
        {
            quote:
                "Искусственный интеллект анализирует твои параметры, образ жизни и цели, чтобы создать оптимальный план питания.",
            name: "ИИ-анализ",
            designation: "Основа персональной диеты",
            src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote:
                "Учитываем рост, вес, возраст, пол, активность и предпочтения — никакой универсальности.",
            name: "Персональные параметры",
            designation: "Диета под твоё тело",
            src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote:
                "Система автоматически рассчитывает калории, белки, жиры и углеводы для достижения цели.",
            name: "Авторасчёт БЖУ",
            designation: "Точная математика питания",
            src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote:
                "Следи за прогрессом, статусом диеты и результатами в удобном личном кабинете.",
            name: "Контроль прогресса",
            designation: "Всё под контролем",
            src: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote:
                "Меняй цели, предпочтения и ограничения — диета обновляется автоматически.",
            name: "Гибкая настройка",
            designation: "Диета подстраивается под тебя",
            src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop",
        },
    ];

    return  <div style={{backgroundColor: '#edffea'}}>
        <div className="absolute z-20 hidden lg:block h-[500px] w-[500px] bg-primary blur-[140px] rounded-full top-40 -left-40" />
        <div className="absolute z-20 hidden lg:block h-[400px] w-[400px] bg-primary blur-[140px] rounded-full bottom-4 right-10" />
        <AnimatedTestimonials testimonials={features} />
    </div>

}
