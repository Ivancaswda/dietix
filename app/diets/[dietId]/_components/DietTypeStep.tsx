import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {ArrowLeft, Leaf, Salad, Utensils} from "lucide-react";
import { useState } from "react";

const DIETS = [
    {
        value: "Обычное",
        label: "Обычное питание",
        description: "Без ограничений по продуктам",
        icon: <Utensils />,
    },
    {
        value: "Вегетарианское",
        label: "Вегетарианское",
        description: "Без мяса и рыбы",
        icon: <Salad />,
    },
    {
        value: "Веганское",
        label: "Веганское",
        description: "Только растительные продукты",
        icon: <Leaf />,
    },
];

export default function DietTypeStep({
                                         onNext,
                                         onBack,
                                     }: {
    onNext: (dietType: string) => void;
    onBack: () => void;
}) {
    const [dietType, setDietType] = useState<string>("");

    return (
        <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Тип питания</h2>
                    <p className="text-muted-foreground">
                        Мы подберём блюда с учётом ваших предпочтений
                    </p>
                </div>


                <div className="flex flex-wrap py-6 gap-4">
                    {DIETS.map((diet) => (
                        <button
                            key={diet.value}
                            onClick={() => setDietType(diet.value)}
                            className={`
                                rounded-2xl border p-4 text-left transition
                                hover:border-primary
                                ${
                                dietType === diet.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                            }
                            `}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-full bg-muted">
                                    {diet.icon}
                                </div>
                                <span className="font-semibold">
                                    {diet.label}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {diet.description}
                            </p>
                        </button>
                    ))}
                </div>


                <div className="space-y-3">
                    <Separator />

                    <p className="text-sm text-muted-foreground text-center">
                        Или укажите свой вариант
                    </p>

                    <Input
                        value={dietType}
                        onChange={(e) => setDietType(e.target.value)}
                        placeholder="Например: кето, без глютена, халяль"
                    />
                </div>


                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft/>
                        Назад
                    </Button>

                    <Button
                        size="lg"
                        disabled={!dietType}
                        onClick={() => onNext(dietType)}
                    >
                        Продолжить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
