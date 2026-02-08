import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import { aiCallsTable, aiMessagesTable } from "@/app/config/schema";
import getServerUser from "@/app/lib/auth-server";

export async function POST(req: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

        const { assistantName, messages, callId } = await req.json();

        console.log('assistantName===', assistantName)
        console.log('messages===', messages)
        console.log(messages.length)
        if (!assistantName || !messages?.length) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }


        const [call] = await db.insert(aiCallsTable).values({
            assistantName,
            createdBy: user.email,
            callId: callId
        }).returning();


        const messageValues = messages.map((msg: any) => ({
            callId: call.id,
            role: msg.role,
            content: msg.content,
        }));

        await db.insert(aiMessagesTable).values(messageValues);

        return NextResponse.json({ success: true, callId: call.id });
    } catch (error) {
        console.error("❌ Save AI call history error:", error);
        return NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 });
    }
}
