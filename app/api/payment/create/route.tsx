import { NextRequest, NextResponse } from "next/server";
import YooKassa from "yookassa";

const yooKassa = new YooKassa({
    shopId: process.env.YOOKASSA_SHOP_ID!,
    secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

const PLAN_PRICES: Record<string, number> = {
    basic: 990,
    premium: 1990,
};

const CREDIT_PACKS: Record<number, number> = {
    5: 500,
    10: 900,
    15: 1300,
    20: 1600,
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, email, plan, credits } = body;

        let amount: number | undefined;
        let description = "";
        let metadata: any = { email, type };

        // 💎 Подписка
        if (type === "plan" && plan) {
            amount = PLAN_PRICES[plan];
            description = `Подписка ${plan}`;
            metadata.plan = plan;
        }

        // ⭐ Кредиты
        if (type === "credits" && credits) {
            amount = CREDIT_PACKS[credits];
            description = `Покупка ${credits} звезд`;
            metadata.credits = credits;
        }

        // ❗ защита от undefined
        if (!amount) {
            return NextResponse.json(
                { error: "Invalid payment data" },
                { status: 400 }
            );
        }

        const payment = await yooKassa.createPayment(
            {
                amount: {
                    value: amount.toFixed(2),
                    currency: "RUB",
                },
                confirmation: {
                    type: "redirect",
                    return_url: "https://dietix-ru.vercel.app/dashboard",
                },
                capture: true,
                description,
                metadata,
            },
            crypto.randomUUID()
        );

        return NextResponse.json({
            url: payment.confirmation.confirmation_url,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "payment error" }, { status: 500 });
    }
}

