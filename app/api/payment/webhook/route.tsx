import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import {dietsTable, usersTable} from "@/app/config/schema";
import {and, eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
    const body = await req.json();

    console.log("Webhook:", body);

    if (body.event === "payment.succeeded") {
        const payment = body.object;
        const plan = payment.metadata.plan;
        const email = payment.metadata.email;

        // 🔥 Тут обновляешь пользователя в БД
        console.log("Оплачен тариф:", plan, email);

        await db
            .update(usersTable)
            .set({
                credits: 10
            })
            .where(
                 eq(usersTable.email, email),


            );

    }

    return NextResponse.json({ ok: true });
}
