"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
    plan: "basic" | "premium";
}

const SubscriptionBanner: React.FC<Props> = ({ plan }) => {
    const router = useRouter();

    const planText =
        plan === "premium" ? "Премиум подписка активна!" : "Базовая подписка активна!";

    return (
        <div  className="bg-primary text-white p-6 rounded-xl shadow-lg my-6 flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-bold">{planText}</h3>
                <p>Теперь у вас есть доступ ко всем возможностям вашего тарифа.</p>
            </div>
            <Button
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => router.push("/premium")}
            >
                Перейти к премиум
            </Button>
        </div>
    );
};

export default SubscriptionBanner;
