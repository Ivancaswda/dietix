import { NextRequest, NextResponse } from "next/server";
import YooKassa from "yookassa";

const yooKassa = new YooKassa({
    shopId: process.env.YOOKASSA_SHOP_ID!,
    secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { plan, email } = await req.json();

        const prices: Record<string, number> = {
            basic: 990,
            premium: 1990,
        };

        const payment = await yooKassa.createPayment(
            {
                amount: {
                    value: prices[plan].toFixed(2),
                    currency: "RUB",
                },
                confirmation: {
                    type: "redirect",
                    return_url: "https://dietix-ru.vercel.app/dashboard",
                },
                capture: true,
                description: `Оплата тарифа ${plan}`,
                metadata: {
                    plan,
                    email,
                },
            },
            Math.random().toString(36).substring(7)
        );

        return NextResponse.json({ url: payment.confirmation.confirmation_url });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Ошибка создания платежа" }, { status: 500 });
    }
}
