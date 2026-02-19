"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const plans = [
    {
        name: "Free",
        price: "0 ₽",
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
        price: "990 ₽",
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
        price: "1990 ₽",
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

export default function PricingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/sign-up");
        }
    }, [router, user, loading]);

    const handleCheckout = async (plan: "basic" | "premium") => {
        const res = await axios.post("/api/payment/create", {
            plan,
            email: user?.email,
        });

        window.location.href = res.data.url;
    };


    const currentPlan = user?.isPremium
        ? "premium"
        : user?.isBasic
            ? "basic"
            : "free";

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
                                    <Button
                                        className="mt-4 w-full "
                                        onClick={() => handleCheckout(p.key as "basic" | "premium")}
                                    >
                                        Купить
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
        </div>
    );
}
