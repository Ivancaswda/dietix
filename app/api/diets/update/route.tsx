import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/app/lib/auth-server";
import db from "@/app/config/db";
import { dietsTable } from "@/app/config/schema";
import { and, eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
    const { dietId, name, description } = await req.json();

    const user = await getServerUser();
    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
        .update(dietsTable)
        .set({
            name,
            notes: description,
            updatedOn: new Date(),
        })
        .where(
            and(
                eq(dietsTable.dietId, dietId),
                eq(dietsTable.createdBy, user.email)
            )
        );

    return NextResponse.json({ success: true });
}
