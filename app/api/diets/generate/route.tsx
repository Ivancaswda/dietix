import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/app/lib/auth-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
    dietsTable,
    mealsTable,
    mealIngredientsTable,
    ingredientReplacementsTable,
    dietMealsTable, usersTable,
} from "@/app/config/schema";
import { eq } from "drizzle-orm";
import db from "@/app/config/db";
import {getMealImage} from "@/app/lib/get-meal-image";
import axios from "axios";
export const DIET_GENERATE_PROMPT = `
Ты — профессиональный диетолог и нутрициолог.

ВАЖНО:
— Отвечай СТРОГО на русском языке
— НЕ используй английские слова
— Названия блюд, ингредиентов, замен — ТОЛЬКО на русском

Твоя задача:
— составить рацион питания на 1 день
— строго уложиться в заданные КБЖУ
— учитывать тип диеты и ограничения

❗ КРИТИЧЕСКИ ВАЖНО:
1. Верни ТОЛЬКО валидный JSON
2. Без markdown, без пояснений, без текста
3. Все числа — integers
4. Суммарные КБЖУ всех блюд ≈ дневным значениям (±5%)
5. mealType — ТОЛЬКО одно из:
   - "завтрак"
   - "обед"
   - "ужин"
   - "перекус"
6. — НЕ ИСПОЛЬЗУЙ продукты из списка ограничений
— Учитывай уже потреблённые КБЖУ

Формат ответа СТРОГО такой:

{
  "meals": [
    {
      "mealType": "завтрак | обед | ужин | перекус",
      "name": "string",
      "calories": number,
      "protein": number,
      "fat": number,
      "carbs": number,
      "ingredients": [
        {
          "name": "string",
          "grams": number,
          "calories": number,
          "protein": number,
          "fat": number,
          "carbs": number,
          "replacements": [
            {
              "name": "string",
              "grams": number,
              "calories": number,
              "protein": number,
              "fat": number,
              "carbs": number
            }
          ]
        }
      ]
    }
  ]
}
`;
function safeJsonParse(text: string) {
    const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
}
export async function POST(req: NextRequest) {
    try {
        const { dietId, data, regenerate} = await req.json();
        const user = await getServerUser();
        console.log('data', data)
        if (!user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }
        const [dbUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, user.email));

        if (!dbUser) {
            return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
        }


        if (!dbUser.credits || dbUser.credits <= 0) {
            return NextResponse.json(
                { error: "NO_CREDITS" },
                { status: 402 }
            );
        }


        await db
            .update(usersTable)
            .set({
                credits: dbUser.credits - 1,
            })
            .where(eq(usersTable.email, user.email));

        if (!data.apiKey) {
            return  NextResponse.json({error: 'No gemini api key'}, {status: 400})
        }


        const [diet] = await db
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
            .where(eq(dietsTable.dietId, dietId))
            .returning();
        if (regenerate) {
            const existingMeals = await db
                .select({ mealId: dietMealsTable.mealId })
                .from(dietMealsTable)
                .where(eq(dietMealsTable.dietId, diet.id));

            const ids = existingMeals.map(m => m.mealId);

            if (ids.length) {
                await db.delete(dietMealsTable).where(eq(dietMealsTable.dietId, diet.id));

            }
        }


        const prompt = `
${DIET_GENERATE_PROMPT}

Входные данные пользователя:
${JSON.stringify(data, null, 2)}

Ограничения пользователя:
${JSON.stringify(data.restrictions)}

Уже съедено сегодня:
${JSON.stringify(data.eatenMeals)}
`;


        const genAI = new GoogleGenerativeAI(data.apiKey);



        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let result
        try {
             result = await model.generateContent(prompt);
        } catch (error) {
            console.log('ApiKeyerror===', error)
            throw new Error("API_KEY_IS_INVALID");
        }


        const rawText = result.response.text();

        let parsed;
        try {
            parsed = safeJsonParse(rawText);
        } catch (e) {
            console.error("❌ JSON parse failed");
            console.error(rawText);
            throw new Error("INVALID_AI_JSON");
        }


        for (const meal of parsed.meals) {
            const imageUrl = await getMealImage(meal.name);

            const vkVideos = await getVkVideos(meal.name);
            console.log('vkVideos====', vkVideos)
            const [mealRow] = await db
                .insert(mealsTable)
                .values({
                    name: meal.name,
                    dietType: data.dietType,
                    calories: meal.calories,
                    protein: meal.protein,
                    fat: meal.fat,
                    carbs: meal.carbs,
                    imageUrl: imageUrl,
                    youtubeVideo: JSON.stringify(vkVideos),
                })
                .returning();

            await db.insert(dietMealsTable).values({
                dietId: diet.id,
                mealId: mealRow.id,
                mealType: meal.mealType,
                plannedCalories: meal.calories,
                plannedProtein: meal.protein,
                plannedFat: meal.fat,
                plannedCarbs: meal.carbs,
            });

            for (const ingredient of meal.ingredients) {
                const [ingredientRow] = await db
                    .insert(mealIngredientsTable)
                    .values({
                        mealId: mealRow.id,
                        ingredientName: ingredient.name,
                        grams: ingredient.grams,
                        calories: ingredient.calories,
                        protein: ingredient.protein,
                        fat: ingredient.fat,
                        carbs: ingredient.carbs,
                    })
                    .returning();

                if (ingredient.replacements) {
                    for (const repl of ingredient.replacements) {
                        await db.insert(ingredientReplacementsTable).values({
                            mealIngredientId: ingredientRow.id,
                            replacedWith: repl.name,
                            grams: repl.grams,
                            calories: repl.calories,
                            protein: repl.protein,
                            fat: repl.fat,
                            carbs: repl.carbs,
                        });
                    }
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("❌ diet generate error", error);

        return NextResponse.json(
            { error: "DIET_GENERATION_FAILED" },
            { status: 500 }
        );
    }
}
const VK_VIDEO_URL = "https://api.vk.com/method/video.search";

export const getVkVideos = async (query: string) => {
    try {
        const resp = await axios.get(VK_VIDEO_URL, {
            params: {
                q: `${query} рецепт`,
                count: 3,
                access_token: process.env.VK_ACCESS_TOKEN,
                v: process.env.VK_API_VERSION || "5.199",
            },
        });

        const items = resp.data?.response?.items || [];

        return items.map((video: any) => ({
            title: video.title,
            player: video.player,
        }));
    } catch (error) {
        console.error("❌ VK video error:", error);
        return [];
    }
};