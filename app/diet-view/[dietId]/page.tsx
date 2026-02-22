"use client";
import { useRef, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {DownloadCloudIcon, Loader2, Loader2Icon, SparklesIcon} from "lucide-react";
import { FaBowlFood } from "react-icons/fa6";
import Image from "next/image";
import { EditDietDialog } from "@/app/diet-view/[dietId]/_components/EditDietDialog";
import { DeleteDietAlert } from "@/app/diet-view/[dietId]/_components/DeleteDietDialog";
import { useAuth } from "@/app/context/useAuth";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import {toast} from "sonner";
import confetti from "canvas-confetti";
import {FaMagic} from "react-icons/fa";
const DietViewPage = () => {
    const { dietId } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth();
    const [regenerating, setRegenerating] = useState(false);

    const printRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        const load = async () => {
            const res = await axios.get(`/api/diets/getOne?dietId=${dietId}`);
            setData(res.data);
            setLoading(false);
        };
        load();
    }, [dietId]);

    const regenerateDiet = async () => {
        try {
            setRegenerating(true);
            console.log('dietReg===')

            await axios.post("/api/diets/generate", {
                dietId,
                regenerate: true,
                data: {
                    ...diet[0]
                },
            });

            toast.success("Рацион обновлён ✨");


            const res = await axios.get(`/api/diets/getOne?dietId=${dietId}`);
            setData(res.data);
        } catch (e) {
            if (e?.response?.data?.error === "NO_CREDITS") {
                toast.error("У вас закончились кредиты 😢");
                router.push('/pricing')
                return;
            }
            console.log(e)
            toast.error('ошибка в генерации!')
        } finally {
            setRegenerating(false);
        }
    };
    useEffect(() => {
        if (regenerating) {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [regenerating]);
    if (loading) {
        return (
            <div className="grid gap-6 max-w-4xl mx-auto my-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-80 animate-pulse bg-muted" />
                ))}
            </div>
        );
    }

    const { diet, meals } = data;

    return (
        <div className="max-w-4xl mt-8 flex flex-col gap-4 mx-auto p-2 sm:p-6 space-y-6">

            <div id='regenerate' className="flex flex-wrap items-center gap-4">
                <Button onClick={() => router.replace("/dashboard")}>
                    <FaBowlFood />
                    К диетам
                </Button>
                <Button
                    variant="secondary"
                    onClick={regenerateDiet}
                    disabled={regenerating}
                    className="gap-2 cursor-pointer hover:scale-105 transition-all"
                >
                    {regenerating ? (
                        <>
                            <Loader2Icon className="animate-spin" />
                            Перегенерация...
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            Перегенерировать
                        </>
                    )}
                </Button>

            </div>



            <div ref={printRef} className="space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-2">
                        <h1 className="text-2xl font-bold">Рацион на день</h1>
                        <div className="flex gap-2 flex-wrap">
                            <Badge>{diet.goal}</Badge>
                            <Badge variant="secondary">{diet.dietType}</Badge>
                            <Badge variant="outline">{diet.calories} ккал</Badge>
                        </div>
                    </CardContent>
                </Card>

                {meals.map((meal: any, idx: number) => (
                    <Card key={idx}>
                        <CardHeader>
                            <div  className="flex items-center justify-between px-1 ">
                                {meal.youtubeVideo !== "[]" ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        <h4 className="font-medium">Видео-рецепты:</h4>
                                        <div className="space-y-2 flex items-center gap-4 w-full">
                                            {JSON.parse(meal.youtubeVideo)
                                                .slice(0, 2)
                                                .map((video: any, i: number) => (
                                                    <div key={i} className="w-full aspect-video">
                                                        <iframe
                                                            className="w-full h-full rounded-lg"
                                                            src={video.player}
                                                            title={video.title}
                                                            allow="autoplay; encrypted-media; fullscreen"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={meal.imageUrl}
                                        className="w-[180px] rounded-xl h-[120px] object-cover"
                                        alt="food"
                                        width={180}
                                        height={120}
                                    />
                                )}
                            </div>

                            <CardTitle className="flex items-center justify-between mt-2">
                <span>
                  {meal.mealType.toUpperCase()} — {meal.name}
                </span>
                                <Badge variant="outline">{meal.plannedCalories} ккал</Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-3 text-sm">
                                <div>🥩 Белки: {meal.plannedProtein} г</div>
                                <div>🧈 Жиры: {meal.plannedFat} г</div>
                                <div>🍞 Углеводы: {meal.plannedCarbs} г</div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <h4 className="font-medium">Ингредиенты:</h4>
                                {meal.ingredients.map((ing: any) => (
                                    <div
                                        key={ing.id}
                                        className="flex justify-between text-sm text-muted-foreground"
                                    >
                    <span>
                      {ing.ingredientName} — <br className='block sm:hidden'/> {ing.grams} г
                    </span>
                                        <span>{ing.calories} ккал</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <div className="flex items-center gap-4">
                    <EditDietDialog
                        diet={diet[0]}
                        onUpdated={(updated) =>
                            setData((prev: any) => ({
                                ...prev,
                                diet: { ...prev.diet, ...updated },
                            }))
                        }
                    />
                    {dietId && <DeleteDietAlert dietId={dietId} />}
                </div>

            </div>
            {regenerating && (
                <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center space-y-4 animate-in fade-in zoom-in">

                        <div className="flex justify-center animate-bounce">
                            <div className="p-4 rounded-full bg-primary/10">
                                <FaMagic className="h-8 w-8 text-primary " />
                            </div>
                        </div>

                        <h3 className="text-lg flex items-center gap-4 text-center justify-center font-semibold">

                            Пересобираем рацион на основе ваших параметров...
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Это может занять до двух минут!
                        </p>
                    </div>
                </div>
            )}
            <p className="text-gray-500 font-semibold text-sm text-center mt-4 mb-4">Не понравился рацион? <a className='text-sm text-primary font-semibold' href="#regenerate">перегенерировать</a></p>
        </div>
    );
};

export default DietViewPage;
