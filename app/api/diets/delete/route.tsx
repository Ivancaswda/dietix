import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/app/lib/auth-server";
import db from "@/app/config/db";
import { dietsTable } from "@/app/config/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dietId = searchParams.get("dietId");

        if (!dietId) {
            return NextResponse.json(
                { error: "dietId is required" },
                { status: 400 }
            );
        }

        const user = await getServerUser();
        if (!user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await db
            .delete(dietsTable)
            .where(
                and(
                    eq(dietsTable.dietId, dietId),
                    eq(dietsTable.createdBy, user.email)
                )
            )
            .returning({ id: dietsTable.dietId });

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Diet not found or not yours" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

