import { NextResponse } from "next/server";
import db from "@/app/config/db";
import { usersTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/app/lib/jwt";
import {jwtDecode} from "jwt-decode";
type VkIdPayload = {
    sub: number;
    first_name?: string;
    last_name?: string;
    picture?: string;
};
export async function POST(req: Request) {
    try {
        const { access_token, user_id,    id_token } = await req.json();

        if (!access_token || !user_id) {
            return NextResponse.json(
                { error: "Missing VK access token" },
                { status: 400 }
            );
        }


        const payload = jwtDecode<VkIdPayload>(id_token);

        const vkUser = {
            id: payload.sub,
            first_name: payload.first_name || "VK",
            last_name: payload.last_name || "User",
            photo_200: payload.picture || "",
        };

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
                    tariff: 'free'
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
                tariff: 'free'
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
