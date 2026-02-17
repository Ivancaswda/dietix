import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import { dietsTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";
import getServerUser from "@/app/lib/auth-server";

export async function POST(req: NextRequest) {
    const { dietId, data } = await req.json();
    const user = await getServerUser();

    if (!user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('data===', data)

    await db
        .update(dietsTable)
        .set({
            goal: data.goal,
            dietType: data.dietType,
            height: data.height,
            weight: data.weight,
            age: data.age,

            calories: data.calories,
            protein: data.protein,
            fat: data.fat,
            carbs: data.carbs,

            apiKey: data.apiKey,

            eatenMeals: data.eatenMeals ?? [],
            restrictions: data.restrictions ?? [],

            isConfigured: 1,
            updatedOn: new Date(),
        })
        .where(eq(dietsTable.dietId, dietId));

    return NextResponse.json({ success: true });
}
