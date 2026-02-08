import db from "@/app/config/db";
import {NextRequest, NextResponse} from "next/server";
import {dietsTable, usersTable} from "@/app/config/schema";
import {desc, eq} from "drizzle-orm";
import getServerUser from "@/app/lib/auth-server";

export async function GET(req: NextRequest) {
    try {
        const user = await getServerUser()

        const dietResult = await db
            .select()
            .from(dietsTable).where(eq(dietsTable.createdBy, user?.email)).orderBy(desc(dietsTable.id));



        return NextResponse.json({diets: dietResult})
    } catch (error) {
        console.error("DB query failed:", error)
        return NextResponse.json({ error: "Failed to fetch diets" }, { status: 500 })
    }
}