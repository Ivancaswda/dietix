"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Copy } from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (apiKey: string, assistantId: string) => void;
};
export const FIRST_MESSAGE = `
Привет. Я Тикси — голосовой ассистент сервиса Диетикс.

Я помогаю разобраться с питанием, целями и рационом.
Мы можем спокойно обсудить твой образ жизни, привычки и задачи.

Я не даю медицинских диагнозов и не заменяю врача,
но помогу подобрать более понятный и комфортный подход к питанию.

Если в процессе мне не будет хватать данных,
я задам уточняющий вопрос.

Скажи, пожалуйста, с какой целью ты хочешь начать разговор.
`.trim();
export const SYSTEM_PROMPT = `
Ты — Тикси, голосовой AI-ассистент сервиса Диетикс.

Диетикс — это сервис персонального питания.
Он помогает пользователям планировать рацион,
разбираться в питании и двигаться к целям без крайностей.

ТВОЯ РОЛЬ:
Спокойный голосовой консультант по питанию.
Ты говоришь как живой человек, а не как медицинский робот.

ОСНОВНЫЕ ПРАВИЛА (ОБЯЗАТЕЛЬНЫ):

Первое.
Никогда не придумывай данные.
Если пользователь не назвал рост, вес, возраст или цель —
скажи, что данных недостаточно, и попроси уточнить.

Второе.
Никогда не додумывай расчёты.
Если невозможно корректно посчитать —
объясни это словами, без цифр.

Третье.
Полный запрет на сокращения.
Нельзя использовать:
— сокращения единиц измерения
— символы процентов
— аббревиатуры
Используй только полные слова.

Четвёртое.
Не используй медицинские диагнозы и сложные медицинские термины.
Не пугай пользователя.
Не оценивай тело негативно.

Пятое.
Если цель выглядит слишком резкой или рискованной —
мягко объясни, почему лучше действовать аккуратно,
и предложи более спокойный вариант.

Шестое.
Если речь пользователя распознана с ошибками —
не интерпретируй фантазией.
Попроси повторить или уточнить.

СЕДЬМОЕ.
ОГРАНИЧЕНИЕ НА ВОПРОСЫ.
За один ответ ты можешь задать:
— не более одного вопроса
— максимум три вопроса только если без них невозможно продолжить разговор
Если можно ответить без вопросов — отвечай без них.

ВОСЬМОЕ.
ФОРМАТ ОТВЕТА.
— коротко или средней длины
— спокойный темп
— без смайликов
— без пафоса
— без мотивационных речей

Если вопрос касается сервиса Диетикс —
объясняй функции, тарифы и возможности простым языком.

Если вопрос не по теме —
мягко возвращай разговор к питанию или сервису.

Отвечай только на русском языке.

`.trim();
export default function VapiApiKeyDialog({ open, onClose, onSave }: Props) {
    const [apiKey, setApiKey] = useState("");
    const [assistantId, setAssistantId] = useState("");
    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Промпт успешно скопирован!")
    };
    const truncate = (text: string, lines = 6) =>
        text.split("\n").slice(0, lines).join("\n") + "\n...";
    return (

        <Dialog   open={open} onOpenChange={onClose}>
            <DialogContent
                className="w-[96vw] max-w-[1400px] h-[90vh] max-h-[90vh] overflow-y-auto rounded-3xl p-8"
            >
                <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                    <DialogTitle className="text-3xl flex items-center gap-2">
                        🗣 Подключение голосового ассистента Тикси
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Подключите Vapi, чтобы общаться с Тикси голосом — быстро и удобно
                    </DialogDescription>
                </DialogHeader>

                <div className='flex items-center gap-6'>
                    <section className="space-y-2">
                        <h3 className="font-semibold">📘 Шаг 1. Получение API Key</h3>
                        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                            <li>Перейдите на сайт <b>https://vapi.ai</b></li>
                            <li>Зарегистрируйтесь или войдите в аккаунт</li>
                            <li>Откройте раздел <b>API Keys</b></li>
                            <li>Создайте и скопируйте API Key</li>
                        </ol>
                    </section>


                    <section className="space-y-2">
                        <h3 className="font-semibold">🧠 Шаг 2. Создание Assistant</h3>
                        <p className="text-sm text-muted-foreground">
                            В панели Vapi создайте нового Assistant и укажите следующие параметры:
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Под именем ассистента находится ASSISTANT_ID, скопируйте и вставьте его сюда!
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Пролистните чуть ниже, найдите меню Transcriber, поменяйте распознование речи на русский
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Нажмите на кнопку Publish
                        </p>
                    </section>
                </div>


                <div className='flex items-center gap-4'>
                    <section className="bg-muted/40 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">🗣 First Message</h4>
                            <Button size="sm" variant="outline" onClick={() => copy(FIRST_MESSAGE)}>
                                <Copy className="w-4 h-4 mr-1" /> Копировать
                            </Button>
                        </div>

                        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
        {truncate(FIRST_MESSAGE, 5)}
      </pre>

                        <p className="text-xs text-muted-foreground mt-2">
                            ℹ️ Используется как первое сообщение ассистента
                        </p>
                    </section>


                    <section className="bg-muted/40 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">⚙️ System Prompt</h4>
                            <Button size="sm" variant="outline" onClick={() => copy(SYSTEM_PROMPT)}>
                                <Copy className="w-4 h-4 mr-1" /> Копировать
                            </Button>
                        </div>

                        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                                {truncate(SYSTEM_PROMPT, 8)}
                              </pre>

                        <p className="text-xs text-muted-foreground mt-2">
                            ℹ️ Определяет поведение и роль ассистента
                        </p>
                    </section>
                </div>
                <Separator className='my-6'/>
                <div className='flex  items-center gap-6 w-full my-2'>
                    <section className="space-y-2">
                        <h3 className="font-semibold">🔐 Введите Vapi API Public Key</h3>
                        <Input
                            type="password"
                            placeholder="vapi_XXXXXXXXXXXXXXXX"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Ключ хранится локально и используется только для голосовых вызовов
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h3 className="font-semibold">🤖 Введите Vapi Assistant ID</h3>
                        <Input
                            placeholder="assistant_XXXXXXXXXXXXXXXX"
                            value={assistantId}
                            onChange={(e) => setAssistantId(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            ID ассистента, созданного в панели Vapi
                        </p>
                    </section>
                </div>




                <div className="flex gap-3 pt-4">
                    <Button
                        className="flex-1"
                        disabled={!apiKey}
                        onClick={() => {
                            onSave(apiKey, assistantId);
                            onClose();
                        }}
                    >
                        Сохранить и начать разговор
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                </div>
            </DialogContent>
        </Dialog>


    );
}
