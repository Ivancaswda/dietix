import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Flame, Beef, Droplet, Wheat } from "lucide-react";
import { useState } from "react";

export default function MacrosStep({
                                       onNext,
                                       onBack,
                                   }: {
    onNext: (data: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
    }) => void;
    onBack: () => void;
}) {
    const [calories, setCalories] = useState<number | "">("");
    const [protein, setProtein] = useState<number | "">("");
    const [fat, setFat] = useState<number | "">("");
    const [carbs, setCarbs] = useState<number | "">("");

    const isValid =
        calories && protein && fat && carbs;

    return (
        <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8 space-y-8">

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">КБЖУ на день</h2>
                    <p className="text-muted-foreground">
                        Эти значения будут использованы для генерации рациона
                    </p>
                </div>


                <div className="flex flex-wrap mt-4 gap-6">
                    <MacrosInput
                        icon={<Flame />}
                        label="Калории"
                        unit="ккал"
                        value={calories}
                        onChange={setCalories}
                    />

                    <MacrosInput
                        icon={<Beef />}
                        label="Белки"
                        unit="г"
                        value={protein}
                        onChange={setProtein}
                    />

                    <MacrosInput
                        icon={<Droplet />}
                        label="Жиры"
                        unit="г"
                        value={fat}
                        onChange={setFat}
                    />

                    <MacrosInput
                        icon={<Wheat />}
                        label="Углеводы"
                        unit="г"
                        value={carbs}
                        onChange={setCarbs}
                    />
                </div>


                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад
                    </Button>

                    <Button
                        size="lg"
                        disabled={!isValid}
                        onClick={() =>
                            onNext({
                                calories: Number(calories),
                                protein: Number(protein),
                                fat: Number(fat),
                                carbs: Number(carbs),
                            })
                        }
                    >
                        Продолжить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function MacrosInput({
                         icon,
                         label,
                         unit,
                         value,
                         onChange,
                     }: {
    icon: React.ReactNode;
    label: string;
    unit: string;
    value: number | "";
    onChange: (v: number | "") => void;
}) {
    return (
        <div className="rounded-2xl border p-4 space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-full bg-muted">
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>

            <div className="relative">
                <Input
                    type="number"
                    value={value}
                    onChange={(e) =>
                        onChange(
                            e.target.value ? Number(e.target.value) : ""
                        )
                    }
                    placeholder={`Введите ${label.toLowerCase()}`}
                    className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {unit}
                </span>
            </div>
        </div>
    );
}
