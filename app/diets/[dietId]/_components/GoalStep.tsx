import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Flame, Minus, Plus } from "lucide-react";
import clsx from "clsx";

type Goal = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

const goals: Goal[] = [
    {
        id: "Похудение",
        title: "Похудение",
        description: "Снижение веса с сохранением мышц",
        icon: <Minus className="h-8 w-8" />,
    },
    {
        id: "Поддержка",
        title: "Поддержка формы",
        description: "Поддержание текущего веса",
        icon: <Flame className="h-8 w-8" />,
    },
    {
        id: "Набор массы",
        title: "Набор массы",
        description: "Рост мышечной массы и силы",
        icon: <Plus className="h-8 w-8" />,
    },
];

export default function GoalStep({
                                     onNext,
                                 }: {
    onNext: (dietType: string) => void;
}) {
    const [goal, setGoal] = useState<string | null>(null);

    return (
        <Card className="max-w-3xl mx-auto my-6">
            <CardContent className="p-8 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Ваша цель</h2>
                    <p className="text-muted-foreground">
                        Выберите основную цель питания
                    </p>
                </div>

                <div className="flex items-center justify-center flex-wrap py-4  gap-4">
                    {goals.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setGoal(g.id)}
                            className={clsx(
                                "rounded-2xl border p-6 text-left transition-all",
                                "hover:shadow-lg hover:-translate-y-1",
                                goal === g.id
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border"
                            )}
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div
                                    className={clsx(
                                        "rounded-full p-4",
                                        goal === g.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {g.icon}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {g.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {g.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <Button
                    size="lg"
                    className="w-full"
                    disabled={!goal}
                    onClick={() => onNext(goal!)}
                >
                    Продолжить
                </Button>
            </CardContent>
        </Card>
    );
}
