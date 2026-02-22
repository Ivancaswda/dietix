import { NextResponse } from "next/server";
import db from "@/app/config/db";
import { usersTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/app/lib/jwt";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json({ error: "No code provided" }, { status: 400 });
        }


        const tokenRes = await fetch("https://oauth.yandex.ru/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                client_id: process.env.YANDEX_CLIENT_ID!,
                client_secret: process.env.YANDEX_CLIENT_SECRET!,
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            return NextResponse.json({ error: "Token error" }, { status: 401 });
        }


        const userRes = await fetch("https://login.yandex.ru/info", {
            headers: {
                Authorization: `OAuth ${tokenData.access_token}`,
            },
        });

        const yandexUser = await userRes.json();

        const email = yandexUser.default_email;
        const name = yandexUser.real_name || yandexUser.display_name;
        const avatar = `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-200`;

        if (!email) {
            return NextResponse.json({ error: "No email" }, { status: 400 });
        }


        const existing = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        let user;

        if (!existing.length) {
            const inserted = await db
                .insert(usersTable)
                .values({
                    name,
                    email,
                    password: "",
                    credits: 1,
                    avatarUrl: avatar,
                    createdAt: new Date().toISOString(),
                    tariff: "free",
                    aiCallCount: 1,
                })
                .returning();

            user = inserted[0];
        } else {
            const updated = await db
                .update(usersTable)
                .set({ name, avatarUrl: avatar })
                .where(eq(usersTable.email, email))
                .returning();

            user = updated[0];
        }


        const token = generateToken({
            email: user.email,
            userName: user.name,
        });

        const response = NextResponse.redirect(
            new URL("/workspace", req.url)
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err) {
        console.error("❌ Yandex login error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}