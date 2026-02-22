import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {ArrowLeft, Leaf, Salad, Utensils} from "lucide-react";
import { useState } from "react";
import {useAuth} from "@/app/context/useAuth";
import {toast} from "sonner";

const ALL_DIETS: any[] = [
    {
        value: "Обычное",
        label: "Обычное питание",
        description: "Без ограничений по продуктам",
        icon: <Utensils />,
        requiredTariff: "free",
    },
    {
        value: "Вегетарианское",
        label: "Вегетарианское",
        description: "Без мяса и рыбы",
        icon: <Salad />,
        requiredTariff: "free",
    },
    {
        value: "Кето",
        label: "Кето",
        description: "Минимум углеводов",
        icon: <Salad />,
        requiredTariff: "basic",
    },
    {
        value: "Веганское",
        label: "Веганское",
        description: "Только растительные продукты",
        icon: <Leaf />,
        requiredTariff: "basic",
    },
    {
        value: "Халяль",
        label: "Халяль",
        description: "Соответствует халяльным стандартам",
        icon: <Utensils />,
        requiredTariff: "premium",
    },
];
const tariffRank = {
    free: 0,
    basic: 1,
    premium: 2,
};
export default function DietTypeStep({
                                         onNext,
                                         onBack,
    draft
                                     }: {
    onNext: (dietType: string) => void;
    onBack: () => void; draft: any
}) {
    const {user} = useAuth()
    const tariff = user?.tariff
    const [dietType, setDietType] = useState<string>(draft.dietType ??"");

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
                    <div className="flex flex-wrap py-6 gap-4">
                        {ALL_DIETS.map((diet) => {
                            const locked =
                                tariffRank[tariff ?? "free"] < tariffRank[diet.requiredTariff];

                            return (
                                <button onClick={() => {
                                    if (locked) {
                                        toast.warning("Обновите подписку, чтобы открыть эту диету 🚀");
                                        return;
                                    }
                                    setDietType(diet.value);
                                }}
                                    key={diet.value}
                                    disabled={locked}
                    style={{maxWidth: '300px'}}
                                    className={` w-full
                                    
          relative rounded-2xl border p-4 text-left transition
          hover:border-primary
          ${
                                        dietType === diet.value
                                            ? "border-primary bg-primary/5"
                                            : "border-border"
                                    }
          ${locked ? "opacity-60 cursor-not-allowed" : ""}
        `}
                                >

                                    {locked && (
                                        <div className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded-full">
                                            {diet.requiredTariff === "premium"
                                                ? "Premium"
                                                : "Upgrade"}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-full bg-muted">
                                            {diet.icon}
                                        </div>
                                        <span className="font-semibold">{diet.label}</span>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {diet.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>


                <div className="space-y-3">
                    <Separator />

                    <p className="text-sm text-muted-foreground text-center">
                        Или укажите свой вариант
                    </p>


                    <div className="relative">

                        {tariff === "free" && (
                            <div className="absolute -top-2 right-2 z-10 text-xs bg-black text-white px-2 py-1 rounded-full">
                                Basic
                            </div>
                        )}


                        <Input
                            value={dietType}
                            readOnly={tariff === "free"}
                            onClick={() => {
                                if (tariff === "free") {
                                    toast.warning("Свободный ввод доступен на Basic и выше 🚀");
                                }
                            }}
                            onChange={(e) => setDietType(e.target.value)}
                            placeholder="Например: кето, без глютена, халяль"
                            className={`
        h-12 text-base transition
        ${tariff === "free" ? "blur-[1px] cursor-not-allowed bg-muted/50" : ""}
      `}
                        />


                        {tariff === "free" && (
                            <div
                                className="absolute inset-0 rounded-md"
                                onClick={() =>
                                    toast.warning("Обновите подписку, чтобы вводить свою диету ✨")
                                }
                            />
                        )}
                    </div>
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
