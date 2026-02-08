// /api/ai-assistant/route.tsx

import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/app/lib/auth-server";
import { GoogleGenerativeAI } from "@google/generative-ai";



const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
export const PROMPT = `
Ты — AI-ассистент сервиса Диетикс.

Диетикс — это AI-сервис персонального питания.
Он помогает пользователям:
- создавать персональные диеты с помощью ИИ
- подбирать рацион под цель (похудение, набор массы, поддержание формы)
- рассчитывать калории и БЖУ
- получать готовые планы питания на день
- редактировать и сохранять диеты
- вести несколько диет (черновики и активные)
- просматривать статистику и прогресс
- пользоваться сервисом без знаний в нутрициологии
- также есть ии голосовой помощник с которым вы можете проконсультироваться и обратиться за помощью в создании диеты (только если у тебя Basic или Premium тариф)
- есть бесплатный тариф (можно создать только 3 диеты), Basic - 10 диет и три раза пользования голосовым помощником-ботом и Premium где все функции открыты безлимитно
- тариф покупается навсегда
- оплата идет через сбер или т-банк онлайн
- связаться с поддержкой можно по кнопке ниже или в конце страницы есть контакты

Твоя задача:
- отвечать на вопросы пользователей о Диетикс
- знай что создателем является Иван Катковский из города Томска - Россия
- знай то что компания была создана в феврале 2026 года
- помогать разобраться с диетами, рационом и функциональностью сервиса
- объяснять просто, дружелюбно и понятно
- давать краткие и полезные ответы
- если вопрос не относится к Диетикс — мягко возвращать разговор к сервису


Важно:
- не давать медицинских диагнозов
- не заменять врача или диетолога
- не рекомендовать опасные или экстремальные диеты
- не давать очень большие ответы, средние давай

Отвечай на русском языке.
`
export async function POST(req: NextRequest) {
    try {
        const { messages} = await req.json();
        const user = await getServerUser();

        if (!user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const history = messages.map((i:any) =>
            i.role === 'assistant' ? `Ассистент: ${i.content}` : `Пользователь: ${i.content}`
        )


        const fullPrompt = `
        ${PROMPT}
        История диалога: 
        ${history}
        Ответь пользователю: 
`;


        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        return NextResponse.json({ content: text });
    } catch (err: any) {
        console.error("❌ Ошибка в /api/ai-assistant:", err);
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}
