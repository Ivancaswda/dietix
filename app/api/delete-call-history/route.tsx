import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import { aiCallsTable, aiMessagesTable } from "@/app/config/schema";
import getServerUser from "@/app/lib/auth-server";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

        const { callId } = await req.json();
        if (!callId) return NextResponse.json({ error: "callId required" }, { status: 400 });


        await db.delete(aiMessagesTable).where(eq(aiMessagesTable.callId, callId));


        await db.delete(aiCallsTable).where(eq(aiCallsTable.id, callId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Delete AI call history error:", error);
        return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
    }
}
