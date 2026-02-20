import { NextResponse } from "next/server";
import db from "@/app/config/db";
import { usersTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/app/lib/jwt";
import { jwtDecode } from "jwt-decode";

type VkIdPayload = {
    sub: number;
    first_name?: string;
    last_name?: string;
    picture?: string;
};

export async function POST(req: Request) {
    try {
        const { access_token, id_token } = await req.json();

        if (!access_token || !id_token) {
            return NextResponse.json(
                { error: "Missing VK tokens" },
                { status: 400 }
            );
        }

        const payload = jwtDecode<VkIdPayload>(id_token);

        let firstName = payload.first_name;
        let lastName = payload.last_name;
        let avatar = payload.picture;

        // 🔥 fallback через VK API
        if (!firstName || !avatar) {
            const vkRes = await fetch(
                `https://api.vk.com/method/users.get?user_ids=${payload.sub}&fields=photo_200&access_token=${access_token}&v=5.199`
            );

            const vkData = await vkRes.json();
            const vkApiUser = vkData.response?.[0];

            if (vkApiUser) {
                firstName = vkApiUser.first_name;
                lastName = vkApiUser.last_name;
                avatar = vkApiUser.photo_200;
            }
        }

        // ✅ ГАРАНТИРОВАННЫЕ значения
        firstName = firstName || "VK";
        lastName = lastName || "User";
        avatar = avatar || "";

        const name = `${firstName} ${lastName}`;
        const email = `vk_${payload.sub}@vk.local`;

        // Проверка юзера
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
                    tariff: "free",
                })
                .returning();

            user = inserted[0];
        } else {
            const updated = await db
                .update(usersTable)
                .set({
                    name,
                    avatarUrl: avatar,
                })
                .where(eq(usersTable.email, email))
                .returning();

            user = updated[0];
        }

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
                tariff: "free",
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
