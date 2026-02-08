import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Flame } from "lucide-react";
import { useState } from "react";
import {FaBowlFood} from "react-icons/fa6";

type Meal = {
    mealName: string;
    calories: number;
};

export function DietDiaryCard({
                                  initialMeals = [],
                                  onNext,
                                  onBack,
                              }: {
    initialMeals?: Meal[];
    onNext: (data: { eatenMeals: Meal[] }) => void;
    onBack: () => void;
}) {
    const [meals, setMeals] = useState<Meal[]>(initialMeals);
    const [mealName, setMealName] = useState("");
    const [calories, setCalories] = useState("");

    const addMeal = () => {
        if (!mealName || !calories) return;

        setMeals([
            ...meals,
            {
                mealName,
                calories: Number(calories),
            },
        ]);

        setMealName("");
        setCalories("");
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">
                        🥗 Что вы уже ели сегодня
                    </h3>
                    <p className="text-muted-foreground">
                        Это поможет точнее подобрать рацион
                    </p>
                </div>


                <div className="flex flex-col mt-4 gap-4">

                    <div className="relative">
                        <Input
                            placeholder="Название блюда"
                            value={mealName}
                            onChange={(e) => setMealName(e.target.value)}
                            className="pl-10 h-12 text-base"
                        />
                        <FaBowlFood className="absolute ml-4 left-0  top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    </div>

                    {/* Calories */}
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="Калории"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            className="pl-10 h-12 text-base"
                        />
                        <Flame className="absolute ml-4 left-0  top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <Button
                        size="lg"
                        className="w-full"
                        onClick={addMeal}
                        disabled={!mealName || !calories}
                    >
                        <Plus className="mr-2" />
                        Добавить
                    </Button>
                </div>


                {meals.length > 0 && (
                    <div className="space-y-3 pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Уже добавлено
                        </h4>

                        {meals.map((m, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-xl border p-3"
                            >
                                <div>
                                    <p className="font-medium">{m.mealName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {m.calories} ккал
                                    </p>
                                </div>
                                <Trash
                                    className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive"
                                    onClick={() =>
                                        setMeals(meals.filter((_, idx) => idx !== i))
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}


                <div className="flex  justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        Назад
                    </Button>
                    <Button onClick={() => onNext({ eatenMeals: meals })}>
                        Продолжить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
