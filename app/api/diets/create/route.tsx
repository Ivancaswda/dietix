import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/app/lib/auth-server";
import db from "@/app/config/db";
import { dietsTable } from "@/app/config/schema";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const { name, description } = await req.json();


    const user = await getServerUser();
    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dietId = nanoid();

    const [diet] = await db
        .insert(dietsTable)
        .values({
            dietId,
            name: name,
            createdBy: user.email,
            status: "active",
            notes: description ?? null,
        })
        .returning();

    return NextResponse.json({
        success: true,
        diet,
    });
}
