import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import { aiCallsTable, aiMessagesTable } from "@/app/config/schema";
import getServerUser from "@/app/lib/auth-server";
import {desc, eq} from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });


        const calls = await db.select().from(aiCallsTable).where(eq(aiCallsTable.createdBy, user.email));


        const callsWithMessages = await Promise.all(calls.map(async (call) => {
            const messages = await db.select().from(aiMessagesTable).where(eq(aiMessagesTable.callId, call.id))
                .orderBy(desc(aiMessagesTable.id));
            return { ...call, messages };
        }));

        return NextResponse.json(callsWithMessages);
    } catch (error) {
        console.error("❌ Get AI call history error:", error);
        return NextResponse.json({ error: "FETCH_FAILED" }, { status: 500 });
    }
}
