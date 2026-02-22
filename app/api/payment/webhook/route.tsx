import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import {paymentsTable, usersTable} from "@/app/config/schema";
import { eq } from "drizzle-orm";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.event !== "payment.succeeded") {
        return NextResponse.json({ ok: true });
    }

    const payment = body.object;
    const meta = payment.metadata;
    const email = meta.email;
    const paymentId = payment.id;

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .then(r => r[0]);

    if (!user) return NextResponse.json({ ok: false });


    const existing = await db
        .select()
        .from(paymentsTable)
        .where(eq(paymentsTable.paymentId, paymentId))
        .limit(1)
        .then(r => r[0]);

    if (existing) {
        console.log("Duplicate webhook:", paymentId);
        return NextResponse.json({ ok: true });
    }

    await db.transaction(async (tx) => {

        if (meta.type === "credits") {
            const creditsToAdd = Number(meta.credits || 0);

            await tx
                .update(usersTable)
                .set({
                    credits: (user.credits || 0) + creditsToAdd,
                })
                .where(eq(usersTable.email, email));
        }


        if (meta.type === "plan") {
            const plan = meta.plan;
            const expiresAt = new Date();

            if (plan === "basic") {
                expiresAt.setMonth(expiresAt.getMonth() + 1);

                await tx.update(usersTable).set({
                    tariff: plan,
                    tariffExpiresAt: expiresAt,
                    aiCallCount: 10,
                }).where(eq(usersTable.email, email));
            }

            if (plan === "premium") {
                expiresAt.setMonth(expiresAt.getMonth() + 3);

                await tx.update(usersTable).set({
                    tariff: plan,
                    tariffExpiresAt: expiresAt,
                    aiCallCount: 9999,
                }).where(eq(usersTable.email, email));
            }
        }
        console.log('payment===', payment)
        console.log('meta===', meta)


        await tx.insert(paymentsTable).values({
            userEmail: user.email,
            paymentId: payment.id,
            amount: Number(payment.amount.value),
            plan: meta.plan ?? null,
            credits: meta.credits ?? null,
            status: "paid",
            createdAt: new Date(),
        });
    });

    return NextResponse.json({ ok: true });
}
