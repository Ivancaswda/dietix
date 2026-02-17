import { NextResponse } from "next/server";
import db from "@/app/config/db";
import { usersTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/app/lib/jwt";

export async function POST(req: Request) {
    try {
        const { access_token, user_id } = await req.json();

        if (!access_token || !user_id) {
            return NextResponse.json(
                { error: "Missing VK access token" },
                { status: 400 }
            );
        }

        // Получаем данные пользователя из VK
        const vkRes = await fetch(
            `https://api.vk.com/method/users.get?user_ids=${user_id}&fields=photo_200&access_token=${access_token}&v=5.199`
        );

        if (!vkRes.ok) {
            return NextResponse.json(
                { error: "Invalid VK token" },
                { status: 401 }
            );
        }

        const vkData = await vkRes.json();

        if (!vkData.response?.[0]) {
            return NextResponse.json(
                { error: "VK user not found" },
                { status: 401 }
            );
        }

        const vkUser = vkData.response[0];

        const name = `${vkUser.first_name} ${vkUser.last_name}`;
        const avatar = vkUser.photo_200;
        const email = `vk_${vkUser.id}@vk.local`; // VK часто не даёт email

        // Проверяем пользователя
        const existingUsers = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        let user;

        if (existingUsers.length === 0) {
            const inserted = await db
                .insert(usersTable)
                .values({
                    name,
                    email,
                    password: "",
                    credits: 1,
                    avatarUrl: avatar,
                    createdAt: new Date().toISOString(),
                })
                .returning();

            user = inserted[0];
        } else {
            const updated = await db
                .update(usersTable)
                .set({ avatarUrl: avatar, name })
                .where(eq(usersTable.email, email))
                .returning();

            user = updated[0];
        }

        // Генерация JWT
        const token = generateToken({
            email: user.email,
            userName: user.name,
        });

        const res = NextResponse.json({
            message: "VK login successful",
            token,
            user: {
                email: user.email,
                userName: user.name,
                avatarUrl: user.avatarUrl,
                credits: user.credits,
            },
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (err) {
        console.error("❌ VK login error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
