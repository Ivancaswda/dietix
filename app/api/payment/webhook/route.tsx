import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import {paymentsTable, usersTable} from "@/app/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const body = await req.json();

    console.log("=== WEBHOOK HIT ===");
    console.log("BODY:", body);

    if (body.event !== "payment.succeeded") {
        return NextResponse.json({ ok: true });
    }

    const payment = body.object;

    if (!payment?.metadata) {
        console.error("NO METADATA", payment);
        return NextResponse.json({ ok: true });
    }

    const meta = payment.metadata;
    const email = meta.email;
    const paymentId = payment.id;

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .then(r => r[0]);

    if (!user) {
        console.error("USER NOT FOUND:", email);
        return NextResponse.json({ ok: true });
    }

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

    try {
        if (meta.type === "credits") {
            const creditsToAdd = Number(meta.credits || 0);

            await db
                .update(usersTable)
                .set({ credits: (user.credits || 0) + creditsToAdd })
                .where(eq(usersTable.email, email));
        }

        if (meta.type === "plan") {
            const plan = meta.plan;
            const expiresAt = new Date();

            if (plan === "basic") expiresAt.setMonth(expiresAt.getMonth() + 1);
            if (plan === "premium") expiresAt.setMonth(expiresAt.getMonth() + 3);

            await db.update(usersTable).set({
                tariff: plan,
                tariffExpiresAt: expiresAt,
                aiCallCount: plan === "premium" ? 9999 : 10,
            }).where(eq(usersTable.email, email));
        }

        await db.insert(paymentsTable).values({
            userEmail: user.email,
            paymentId: payment.id,
            amount: Number(payment.amount.value),
            plan: meta.plan ?? null,
            credits: meta.credits ?? null,
            status: "paid",
            createdAt: new Date(),
        });

    } catch (err) {
        console.error("DB ERROR:", err);
    }

    return NextResponse.json({ ok: true });
}