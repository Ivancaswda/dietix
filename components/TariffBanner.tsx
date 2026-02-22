"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {useAuth} from "@/app/context/useAuth";
import {LoaderOne} from "@/components/ui/loader";



export default function TariffBanner( ) {
    const router = useRouter();
    const {user, loading} = useAuth()
    console.log(user)

    if (!user && loading) {
        return <div className='flex items-center justify-center w-screen h-screen'>
            <LoaderOne/>
        </div>
    }
    if (user?.tariff === "premium") {
        return (
            <Card className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white border-0 shadow-xl">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6" />
                        <div>
                            <h3 className="text-2xl font-semibold">Premium активен</h3>
                            <p className="text-sm opacity-90">
                                Вам доступны все функции без ограничений
                            </p>
                        </div>
                    </div>
                    <Sparkles className="w-6 h-6" />
                </CardContent>
            </Card>
        );
    }
    if (user?.tariff === 'basic') {
        return (
            <Card className="bg-gradient-to-r bg-primary text-white  border-0 shadow-lg">
                <CardContent className="p-6 flex-col gap-4 md:flex-row flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold text-left  ">Basic тариф</h3>
                        <p className="text-sm opacity-80 text-center">
                            Откройте Premium для расширенных возможностей
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push("/pricing")}
                        className="bg-white text-black hover:scale-105 transition-all hover:bg-gray-200"
                    >
                        Перейти на Premium
                    </Button>
                </CardContent>
            </Card>
        )
    }


    return (
        <div></div>
    );
}
