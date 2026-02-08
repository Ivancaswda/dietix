import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {Ruler, Weight, Calendar, ArrowLeft} from "lucide-react";

export default function BodyParamsStep({
                                           onNext,
                                           onBack,
                                       }: {
    onNext: (params: { height: number; weight: number; age: number }) => void;
    onBack: () => void;
}) {
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [age, setAge] = useState<number | "">("");

    const isValid = height && weight && age;

    return (
        <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8 space-y-8">

                <div className="text-center space-y-2 mb-6">
                    <h2 className="text-2xl font-bold">Параметры тела</h2>
                    <p className="text-muted-foreground">
                        Эти данные нужны для точного расчёта рациона
                    </p>
                </div>


                <div className="flex flex-wrap  gap-6">
                    <ParamInput
                        icon={<Ruler />}
                        label="Рост"
                        unit="см"
                        value={height}
                        onChange={setHeight}
                    />

                    <ParamInput
                        icon={<Weight />}
                        label="Вес"
                        unit="кг"
                        value={weight}
                        onChange={setWeight}
                    />

                    <ParamInput
                        icon={<Calendar />}
                        label="Возраст"
                        unit="лет"
                        value={age}
                        onChange={setAge}
                    />
                </div>


                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft/>
                        Назад
                    </Button>

                    <Button
                        size="lg"
                        disabled={!isValid}
                        onClick={() =>
                            onNext({
                                height: Number(height),
                                weight: Number(weight),
                                age: Number(age),
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



function ParamInput({
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
        <div className="rounded-2xl border p-4 space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-full bg-muted">{icon}</div>
                <span className="font-medium">{label}</span>
            </div>

            <div className="relative">
                <Input
                    type="number"
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value ? Number(e.target.value) : "")
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
