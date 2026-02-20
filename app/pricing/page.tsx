"use client";
import  {motion} from 'framer-motion'
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "@/app/context/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Stars} from "lucide-react";
import {toast} from "sonner";
import {LoaderOne} from "@/components/ui/loader";

const plans = [
    {
        name: "Free",
        price: 0,
        description: "Базовый доступ",
        perks: [
            "0 звонков с AI Диетикс",
            "Ограниченная возможность брони стоматологов (3)",
            "Стандартная поддержка",
        ],
        key: "free",
    },
    {
        name: "Basic",
        price: 990,
        description: "Для активных пользователей",
        perks: [
            "До 3 звонков с AI Диетикс",
            "Безграничная возможность брони стоматологов",
            "Поддержка отвечает на 20% быстрее",
            "Улучшенные рекомендации и интерфейс сайта",
            "Подписка оформляется навсегда (в случае удаления аккаунта, деньги не возвращаются)"
        ],
        key: "basic",
    },
    {
        name: "Premium",
        price: 1990,
        description: "Полный доступ ко всем функциям",
        perks: [
            "Неограниченные звонки с AI Диетикс",
            "Полный доступ к бронированию стоматологов",
            "Приоритетная поддержка",
            "Эксклюзивные функции и рекомендации",
            "Подписка оформляется навсегда (в случае удаления аккаунта, деньги не возвращаются )"
        ],
        key: "premium",
    },
];
const creditOptions = [
    { credits: 5, price: 500, variantId: "12345", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/961db7ee-80a9-4e30-8bed-3259ad456476" },
    { credits: 10, price: 900, variantId: "12346", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/655f7132-2f94-425f-9989-4449ee74f84c" },
    { credits: 15, price: 1300, variantId: "12347", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/3d75fc02-c9f4-4bb1-bcf4-a8062893dbb1" },
    { credits: 20, price: 1600, variantId: "12348", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/122afb0b-1501-4e75-9826-b983708e2595" },
];

export default function PricingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [pending, setPending] = useState<boolean>()
    useEffect(() => {
        if (!user && !loading) {
            router.replace("/sign-up");
        }
    }, [router, user, loading]);

    const handleCheckout = async (plan: "basic" | "premium") => {
        try {
            setPending(true)
            const res = await axios.post("/api/payment/create", {
                type: "plan",
                plan,
                email: user?.email,
            });

            window.location.href = res.data.url;
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log(error)
            toast.error('Не удалось осуществить оплату!')
        }

    };
    const buyCredits = async (credits: number) => {
        try {
            setPending(true)
            const res = await axios.post("/api/payment/create", {
                type: "credits",
                credits,
                email: user?.email,
            });
            setPending(false)
            window.location.href = res.data.url;
        } catch (error) {
            setPending(false)
            console.log(error)
            toast.error('Не удалось осуществить оплату!')
        }

    };

    const currentPlan = user?.isPremium
        ? "premium"
        : user?.isBasic
            ? "basic"
            : "free";
    if (loading && !user) {
        return  <div className='flex items-center justify-center w-screen h-screen'>
            <LoaderOne/>
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">

            <div className="text-center mb-12 mt-6">
                <h1 className="text-4xl  lg:text-5xl font-bold mb-4">
                    Выберите тариф
                </h1>
                <p className="text-sm text-muted-foreground text-gray-700 max-w-xl mx-auto">
                    Оплата осуществляется безопасно через ЮKassa.  Начните с бесплатного,
                    затем улучшите тариф для получения дополнительных возможностей с AI Диетикс
                    и бронированием стоматологов.
                </p>
            </div>

            <div className="flex mt-4 flex-col lg:flex-row items-start gap-12 max-w-7xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                    {plans.map((p) => {
                        const isActive = currentPlan === p.key;
                        return (
                            <div
                                key={p.name}
                                className={`border rounded-xl p-6 shadow-lg flex flex-col justify-between transition-transform duration-300 cursor-pointer
                                    ${isActive ? "border-green-500 bg-green-50" : p.key !== "free" ? "border-indigo-500 hover:scale-105" : "border-gray-300"}
                                `}
                            >
                                <div>
                                    <h2 className="text-2xl font-semibold mb-2 ">{p.name}</h2>
                                    <p className="text-gray-600 mb-4 text-muted-foreground">{p.description}</p>
                                    <p className="text-3xl font-bold mb-4">{p.price}</p>
                                    <ul className="text-gray-700 mb-4 space-y-2">
                                        {p.perks.map((perk, i) => (
                                            <li key={i} className="flex text-muted-foreground items-center">
                                                <span className="mr-2 text-green-500">✔</span>
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {isActive ? (
                                    <Button disabled className="mt-4 w-full bg-green-500 text-white">
                                        Активен
                                    </Button>
                                ) : p.key !== "free" ? (
                                    <Button disabled={pending}
                                        className="mt-4 w-full "
                                        onClick={() => handleCheckout(p.key as "basic" | "premium")}
                                    >
                                        {pending ? 'Загрузка...' : 'Купить'}

                                    </Button>
                                ) : (
                                    <Button disabled className="mt-4 w-full">
                                        Текущий тариф
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>


            </div>

            <div className="min-h-screen relative w-full overflow-hidden  py-20 px-4">


                <div className="max-w-5xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 ">
                        Выберите кол-во <span className="text-primary">звезд</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Покупайте звезды для создания сайтов с помощью Websity.
                        Больше звезд — выгоднее!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {creditOptions.map((plan, i) => (
                        <motion.div
                            key={plan.credits}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Card className="border-2 border-transparent hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2 ">
                                        <Stars className="text-primary" /> {plan.credits} звезд
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-4xl font-bold ">{plan.price} Руб</p>
                                    <p className="text-gray-500 text-sm">
                                        {plan.credits } генераций контента
                                    </p>
                                    <Button disabled={pending}
                                        onClick={() => buyCredits(plan.credits)}
                                    >
                                        {pending ? 'Загрузка...' : 'Купить'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    * 1 звезда = 1 генерация контента. Звезды не сгорают.
                </div>
            </div>
        </div>
    );
}
