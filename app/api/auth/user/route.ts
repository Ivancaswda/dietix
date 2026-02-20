import {verifyToken} from "@/app/lib/jwt";
import db from "@/app/config/db";
import {usersTable} from "@/app/config/schema";
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import {ensureValidTariff} from "@/app/lib/ensureValidTariff";

export async function GET(req: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const decoded = verifyToken(token) as { email: string }

        const users = await db.select().from(usersTable).where(eq(usersTable.email, decoded.email)).limit(1)

        let user = users[0]

        if (!user) {
            return new Response("User not found", { status: 404 })
        }
        user = await ensureValidTariff(user);
        return Response.json({
            user: {
                email: user.email,
                userName: user.name,
                createdAt: user.createdAt,
                avatarUrl: user?.avatarUrl,
                credits: user?.credits,
                tariff: user?.tariff,
                tariffExpiresAt: user?.tariffExpiresAt,
                aiCallCount: user.aiCallCount
            },
        })
    } catch (err: any) {
        return new Response("Invalid token", { status: 401 })
    }
}  