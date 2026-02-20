"use client";
import { useRef, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DownloadCloudIcon, Loader2Icon } from "lucide-react";
import { FaBowlFood } from "react-icons/fa6";
import Image from "next/image";
import { EditDietDialog } from "@/app/diet-view/[dietId]/_components/EditDietDialog";
import { DeleteDietAlert } from "@/app/diet-view/[dietId]/_components/DeleteDietDialog";
import { useAuth } from "@/app/context/useAuth";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";

const DietViewPage = () => {
    const { dietId } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth();


    const printRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        const load = async () => {
            const res = await axios.get(`/api/diets/getOne?dietId=${dietId}`);
            setData(res.data);
            setLoading(false);
        };
        load();
    }, [dietId]);

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
        <div className="max-w-4xl flex flex-col gap-4 mx-auto p-6 space-y-6">
            {/* Кнопки */}
            <div className="flex flex-wrap gap-4">
                <Button onClick={() => router.replace("/dashboard")}>
                    <FaBowlFood />
                    К диетам
                </Button>

            </div>

            {/* Контент для печати */}
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
                            <div className="flex items-center justify-between px-4">
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
                      {ing.ingredientName} — {ing.grams} г
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
        </div>
    );
};

export default DietViewPage;
