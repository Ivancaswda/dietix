"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, RefreshCcw, CreditCard, MessageCircle } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FloatingAssistant from "@/components/FloatingAssistant";

export default function AboutPricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 ">
            <div className="max-w-4xl mx-auto mb-4 px-4 space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold">Оплата и возвраты в <span className='text-primary'>Диетикс</span></h1>
                    <p className="text-muted-foreground text-lg">
                        Всё, что нужно знать о покупке тарифов, звёзд и возврате средств.
                    </p>
                </div>

                {/* Payment info */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="text-primary" /> Как проходит оплата
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Все платежи в Dietix обрабатываются через безопасный платёжный сервис
                            <span className="font-semibold text-foreground"> ЮKassa</span>.
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Поддерживаются банковские карты, СБП и другие способы оплаты</li>
                            <li>Мы не храним данные ваших карт</li>
                            <li>Все транзакции защищены на стороне платёжного провайдера</li>
                            <li>После оплаты вы автоматически возвращаетесь на сайт</li>
                        </ul>

                        <p>
                            Сразу после успешной оплаты тариф или звёзды автоматически
                            активируются на вашем аккаунте.
                        </p>
                    </CardContent>
                </Card>

                {/* Payment ID */}
                <Card className="shadow-md border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="text-primary" /> Обязательно сохраните Payment ID
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            После оплаты платёжная система покажет вам <b>код платежа (Payment ID)</b>.
                        </p>

                        <div className="bg-muted rounded-xl p-4 text-sm">
                            Пример: <span className="font-mono">312aba64-000f-5001-8000-1682b0390a69</span>
                        </div>

                        <p>
                            Рекомендуем сохранить этот код — он понадобится, если вы захотите
                            оформить возврат или обратиться в поддержку.
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Скопируйте код сразу после оплаты</li>
                            <li>Сохраните в заметки или скриншот</li>
                            <li>Без него возврат может занять больше времени</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Refunds */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCcw className="text-primary" /> Возврат средств
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Мы стараемся быть максимально лояльными к пользователям и рассматриваем
                            заявки на возврат в индивидуальном порядке.
                        </p>

                        <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
                            <p className="font-medium text-foreground">Для возврата потребуется:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Ваш email в Dietix</li>
                                <li>Payment ID платежа</li>
                                <li>Краткое описание причины возврата</li>
                            </ul>
                        </div>

                        <p>
                            После проверки мы сможем найти платёж в системе и помочь с возвратом
                            через платёжного провайдера.
                        </p>
                    </CardContent>
                </Card>

                {/* Support */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="text-primary" /> Как связаться с поддержкой
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Если у вас возникли проблемы с оплатой или нужен возврат — напишите
                            в поддержку Dietix.
                        </p>

                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                            Кнопка поддержки находится в правом нижнем углу сайта.
                            Нажмите на неё, чтобы открыть чат с командой Dietix.
                        </div>

                        <p>
                            Обычно мы отвечаем в течение 24 часов. В сложных случаях — до 3 рабочих дней.
                        </p>
                    </CardContent>
                </Card>


                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild variant="outline">
                        <Link href="/pricing">Назад к тарифам</Link>
                    </Button>

                    <Button asChild>
                        <Link href="/dashboard">Перейти в приложение</Link>
                    </Button>
                </div>
            </div>
            <Footer/>
            <FloatingAssistant/>
        </div>
    );
}
