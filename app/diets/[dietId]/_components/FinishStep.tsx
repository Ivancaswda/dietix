"use client";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {CheckCircle, AlertTriangle, ArrowLeft, Loader2, SparklesIcon} from "lucide-react";
import {useState, useMemo, useEffect} from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {FaMagic} from "react-icons/fa";
import {useAuth} from "@/app/context/useAuth";

const BASE_REQUIRED_FIELDS: Record<string, string> = {
    goal: "Цель",
    height: "Рост",
    weight: "Вес",
    age: "Возраст",
    dietType: "Тип питания",
    calories: "Калории",
    protein: "Белки",
    fat: "Жиры",
    carbs: "Углеводы",
};

export default function FinishStep({
                                       dietId,
                                       data,
                                       onBack,
                                   }: {
    dietId: string;
    data: any;
    onBack: () => void;
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();
    const {user} = useAuth()
    const requiredFields = useMemo(() => {
        const fields = { ...BASE_REQUIRED_FIELDS };

        const hasSubscription =
            user?.tariff && user.tariff !== "free";

        if (!hasSubscription) {
            fields.apiKey = "Gemini API Key";
        }

        return fields;
    }, [user]);
    const missingFields = useMemo(() => {
        return Object.entries(requiredFields)
            .filter(([key]) => !data?.[key])
            .map(([, label]) => label);
    }, [data, requiredFields]);

    useEffect(() => {
        document.body.style.overflow = isGenerating ? "hidden" : "auto";
    }, [isGenerating]);

    const canGenerate = missingFields.length === 0;
    console.log(data)
    const onGenerate = async () => {
        if (!canGenerate) {
            toast.error(
                `Заполните обязательные поля: ${missingFields.join(", ")}`
            );
            return;
        }

        try {
            setIsGenerating(true);
            const payloadData = { ...data };

            if (user?.tariff && user.tariff !== "free") {
                delete payloadData.apiKey;
            }
            await axios.post("/api/diets/generate", {
                dietId,
                data,
            });

            toast.success("Рацион успешно сгенерирован!");
            router.replace(`/diet-view/${dietId}`);
        } catch (e: any) {
            if (e?.response?.data?.error === "NO_CREDITS") {
                toast.error("У вас закончились кредиты 😢");
                router.push('/pricing')
                return;
            }
            toast.error("Ошибка генерации рациона");
        } finally {
            setIsGenerating(false);
        }
    };
    useEffect(() => {
        if (canGenerate && !isGenerating) {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [canGenerate]);
    return (
        <Card>
            <CardContent className="p-6 space-y-6 text-center">
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full
    ${canGenerate ? "bg-green-500/10" : "bg-orange-500/10"}
`}>
                    {canGenerate ? (
                        <CheckCircle className="text-green-500" size={36} />
                    ) : (
                        <AlertTriangle className="text-orange-500" size={36} />
                    )}
                </div>

                {isGenerating && (
                    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-background rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center space-y-4 animate-in fade-in zoom-in">

                            <div className="flex justify-center">
                                <div className="p-4 rounded-full bg-primary/10">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                </div>
                            </div>

                            <h3 className="text-lg flex items-center gap-4 text-center justify-center font-semibold">
                                <SparklesIcon className='text-primary'/>  Генерируем рацион <SparklesIcon className='text-primary'/>
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Подбираем блюда, считаем КБЖУ и составляем ингредиенты.<br />
                                Это может занять от 10–25 секунд до 2-3 минут.
                            </p>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold">
                    {canGenerate ? "Всё готово 🚀" : "Почти готово"}
                </h2>

                <p className="text-muted-foreground max-w-md mx-auto">
                    {canGenerate
                        ? "Мы собрали все параметры. Нажмите кнопку ниже — и ИИ создаст персональный рацион."
                        : "Заполните недостающие шаги, чтобы мы смогли создать рацион под вас."}
                </p>

                {!canGenerate && (
                    <div className="text-sm text-left bg-muted rounded-xl p-6 my-6 space-y-1">
                        <p className="font-medium mb-2">Не хватает:</p>
                        <ul className="list-disc list-inside p-6 text-muted-foreground">
                            {missingFields.map((f) => (
                                <li key={f}>{f}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft/>
                        Назад
                    </Button>

                    <Button
                        size="lg"
                        className="gap-2 px-8"
                        onClick={onGenerate}
                        disabled={!canGenerate || isGenerating}
                    >
                        <FaMagic className="text-lg" />
                        {isGenerating ? "Генерация..." : "Создать рацион"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
