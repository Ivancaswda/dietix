import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import { usersTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (body.event !== "payment.succeeded") {
        return NextResponse.json({ ok: true });
    }

    const payment = body.object;
    const meta = payment.metadata;

    const email = meta.email;

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .then((r) => r[0]);

    if (!user) return NextResponse.json({ ok: false });
    console.log('user===', user)
    console.log('metaType===', meta.type)
    if (meta.type === "credits") {
        const creditsToAdd = Number(meta.credits || 0);

        await db
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
            await db
                .update(usersTable)
                .set({
                    tariff: plan,
                    tariffExpiresAt: expiresAt,
                    aiCallCount: 10
                })
                .where(eq(usersTable.email, email));
        }

        if (plan === "premium") {
            expiresAt.setMonth(expiresAt.getMonth() + 3);
            await db
                .update(usersTable)
                .set({
                    tariff: plan,
                    tariffExpiresAt: expiresAt,
                })
                .where(eq(usersTable.email, email));
        }

        console.log("expiresAt===", expiresAt);


    }

    return NextResponse.json({ ok: true });
}
