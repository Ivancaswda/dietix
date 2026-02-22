import db from "@/app/config/db";
import {NextRequest, NextResponse} from "next/server";
import {usersTable} from "@/app/config/schema";
import {eq} from "drizzle-orm";
import getServerUser from "@/app/lib/auth-server";

export async function POST(req: NextRequest) {
    const { name, email, avatarUrl } = await req.json();
    const user= await getServerUser()
    if (!user) {
        return  NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
    await db
        .update(usersTable)
        .set({
            name,
            avatarUrl,
        })
        .where(eq(usersTable.email, user.email));

    return NextResponse.json({ ok: true });
}