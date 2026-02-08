import { NextRequest, NextResponse } from "next/server";
import db from "@/app/config/db";
import {
    dietsTable,
    dietMealsTable,
    mealsTable,
    mealIngredientsTable,
} from "@/app/config/schema";
import { eq } from "drizzle-orm";
import getServerUser from "@/app/lib/auth-server";

export async function GET(
    req: NextRequest
) {

    const { searchParams } = new URL(req.url)

    const dietId = searchParams.get("dietId")
    const user = await getServerUser();
    if (!user) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    const diet = await db
        .select()
        .from(dietsTable).where(eq(dietsTable.dietId, dietId))


    if (!diet[0]) {
        return NextResponse.json({ error: "Diet not found" }, { status: 404 });
    }

    const meals = await db
        .select({
            mealType: dietMealsTable.mealType,
            plannedCalories: dietMealsTable.plannedCalories,
            plannedProtein: dietMealsTable.plannedProtein,
            plannedFat: dietMealsTable.plannedFat,
            plannedCarbs: dietMealsTable.plannedCarbs,
            mealId: mealsTable.id,
            name: mealsTable.name,
            imageUrl: mealsTable.imageUrl,
            youtubeVideo: mealsTable.youtubeVideo
        })
        .from(dietMealsTable)
        .leftJoin(mealsTable, eq(dietMealsTable.mealId, mealsTable.id))
        .where(eq(dietMealsTable.dietId, diet[0].id));

    const mealsWithIngredients = await Promise.all(
        meals.map(async (meal) => {
            const ingredients = await db
                .select()
                .from(mealIngredientsTable)
                .where(eq(mealIngredientsTable.mealId, meal.mealId));

            return {
                ...meal,
                ingredients,
            };
        })
    );

    return NextResponse.json({
        diet,
        meals: mealsWithIngredients,
    });
}
