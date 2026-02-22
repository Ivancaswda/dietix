'use client'
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/useAuth";
import { useRouter } from "next/navigation";
import {GiConfirmed, GiTick} from "react-icons/gi";

function PricingSection() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <section id="pricing" style={{backgroundColor: '#edffea'}} className="py-32 px-6 bg-muted/30">
            <div className="max-w-6xl mx-auto text-center mb-20">
                <h2 className="text-5xl font-bold mb-4">Тарифы Диетикс</h2>
                <p className="text-xl text-muted-foreground">
                    Персональное питание с ИИ — без подписок и скрытых платежей
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {/* FREE */}
                <div className="relative p-8 rounded-3xl bg-card border shadow-sm flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                    <p className="text-muted-foreground mb-4">
                        Попробовать возможности Диетикс
                    </p>

                    <p className="text-4xl font-bold mb-6">0 ₽</p>

                    <ul className="space-y-3 text-muted-foreground mb-8">
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Базовая ИИ-диета</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Обычная поддержка</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> 1 попытка консультации с Тикси AI</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Добавление Gemini ключа</li>
                    </ul>

                    <Button disabled className="mt-auto w-full">
                        Уже есть
                    </Button>
                </div>


                <div className="relative p-8 rounded-3xl bg-card border-2 border-primary shadow-xl scale-[1.03] flex flex-col">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Самый популярный
                    </div>

                    <h3 className="text-2xl font-bold mb-2">Basic</h3>
                    <p className="text-muted-foreground mb-4">
                        Для достижения реального результата
                    </p>

                    <p className="text-4xl font-bold text-primary mb-6">990 ₽</p>

                    <ul className="space-y-3 text-muted-foreground mb-8">
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Полная персональная диета</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> 10 попыток консультации с Тикси AI</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Без добавления Gemini Api ключа</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Возможность возврата</li>
                    </ul>

                    <Button
                        onClick={() => router.replace("/pricing")}
                        disabled={user?.tariff === 'basic'}
                        className="mt-auto w-full"
                    >
                        {user?.tariff  === "basic" ? "Уже подключён" : "Получить"}
                    </Button>
                </div>

                {/* PREMIUM */}
                <div className="relative p-8 rounded-3xl bg-card border shadow-sm flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">Premium</h3>
                    <p className="text-muted-foreground mb-4">
                        Максимальный контроль и гибкость
                    </p>

                    <p className="text-4xl font-bold mb-6">1 990 ₽</p>

                    <ul className="space-y-3 text-muted-foreground mb-8">
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Всё из Basic</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Элитная поддержка</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Тонкая настройка питания</li>
                        <li className='flex items-center gap-4'><GiConfirmed className='text-primary'/> Выгоднее Basic</li>
                    </ul>

                    <Button
                        variant="outline"
                        onClick={() => router.replace("/pricing")}
                        disabled={user?.tariff === 'premium'}
                        className="mt-auto w-full"
                    >
                        {user?.tariff === 'premium' ? "Уже подключён" : "Подключить"}
                    </Button>
                </div>
            </div>

        </section>
    );
}

export default PricingSection;
