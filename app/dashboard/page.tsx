"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/context/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { FaBowlFood } from "react-icons/fa6";
import { MoreVertical, TableConfigIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";


import { DeleteDietAlert } from "@/app/diet-view/[dietId]/_components/DeleteDietDialog";
import { EditDietDialog} from "@/app/diet-view/[dietId]/_components/EditDietDialog";
import Link from "next/link";
import {formatRelativeTime} from "@/app/lib/utils";
import FloatingAssistant from "@/components/FloatingAssistant";
import {useDiets} from "@/app/context/DietsContext";

const DashboardPage = () => {
    const router = useRouter();
    const { user, loading } = useAuth();
    const {diets} = useDiets()
    const [Diets, setDiets] = useState(diets ?? []);
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [pending, setPending]  = useState<boolean>(true)
    const getAllDiets = async () => {
        try {
            const { data } = await axios.get("/api/diets/getAll");
            setDiets(data.diets ?? []);
            setPending(false)
        } catch (error) {
            setPending(false)
            toast.error("Не удалось получить диеты");
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) getAllDiets();
    }, [user]);

    const completed = diets.filter((d) => d.isConfigured);
    const drafts = diets.filter((d) => !d.isConfigured);

    const handleDietCreate = async () => {
        try {
            setIsCreating(true);
            const { data } = await axios.post("/api/diets/create", { name, description: desc });
            setIsCreating(false);
            router.push(`/diets/${data.diet.dietId}`);
            toast.success("Диета создана!");
        } catch (error) {
            setIsCreating(false);
            toast.error("Не удалось создать диету!");
        }
    };

    return (
        <div className="min-h-screen  relative p-6 space-y-10 bg-gray-50">


            <div className="flex items-center my-6 justify-center">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" size="lg">
                            <FaBowlFood />
                            Создать новую диету
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Создать новую диету</DialogTitle>
                            <p>Заполните минимальные данные чтобы начать пользоваться сервисом</p>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name-1">Название</Label>
                                <Input id="name-1" placeholder="Моя Первая Диета" value={name} onChange={(e) => setName(e.target.value)} />
                            </Field>
                            <Field>
                                <Label htmlFor="desc-1">Описание</Label>
                                <Input id="desc-1" placeholder="Диета для похудения" value={desc} onChange={(e) => setDesc(e.target.value)} />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Отменить</Button>
                            </DialogClose>
                            <Button disabled={isCreating} onClick={handleDietCreate}>
                                {isCreating ? "Подождите..." : "Создать диету"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {pending ? (
                <>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold animate-pulse bg-gray-200 h-8 w-48 rounded"></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border-dashed border rounded-lg p-5 space-y-2 animate-pulse bg-gray-100 h-40"></div>
                            ))}
                        </div>
                    </section>


                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold animate-pulse bg-gray-200 h-8 w-48 rounded"></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border rounded-lg p-5 space-y-2 animate-pulse bg-gray-100 h-44"></div>
                            ))}
                        </div>
                    </section>
                </>
            ) : <>
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Черновики диет</h2>






            {drafts.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FaBowlFood className="text-primary" />
                        </EmptyMedia>
                        <EmptyTitle>Нет данных</EmptyTitle>
                        <EmptyDescription>Черновики не найдены</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="flex flex-wrap  gap-6 w-full">
                    {drafts.map((diet) => (
                        <Link href={`/diets/${diet.dietId}`}>
                            <Card  key={diet.dietId} className="border-dashed">
                                <CardContent className="p-5 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                    <div className="flex gap-4 items-center justify-between">
                                        <h3 className="text-lg font-medium">{diet.name}</h3>
                                        <Badge variant="secondary">Не настроена</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{diet.notes}</p>
                                    <p className="text-xs text-muted-foreground">Создана: {formatRelativeTime(diet.createdOn)}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button  onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }} variant="ghost">
                                                    <MoreVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <div className="flex flex-col p-4 gap-3">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>  router.push(`/diet-view/${diet.dietId}`)}
                                                        className="flex items-center gap-2 text-gray-700"
                                                    >
                                                        <TableConfigIcon size={18} /> Открыть
                                                    </Button>

                                                    <Button onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                    }} variant='ghost'>
                                                        <EditDietDialog  diet={diet} onUpdated={() => getAllDiets()} />
                                                    </Button>

                                                    <Button onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                    }} variant='ghost'>
                                                        <DeleteDietAlert dietId={diet.dietId} />
                                                    </Button>


                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
            </section>


                <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Активные диеты</h2>
            {completed.length === 0 ? (
                <Empty>
                <EmptyHeader>
                <EmptyMedia variant="icon">
                <FaBowlFood className="text-primary" />
                </EmptyMedia>
                <EmptyTitle>Нет данных</EmptyTitle>
                <EmptyDescription>Активные диеты не найдены</EmptyDescription>
                </EmptyHeader>
                </Empty>
                ) : (
                <div className="flex flex-wrap gap-6 w-full">
            {completed.map((diet) => (
                <Link href={`/diet-view/${diet.dietId}`}>
                    <Card key={diet.dietId}>
                        <CardContent className="p-5 space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-4 justify-between">
                                        <h3 className="text-lg font-medium">{diet.name}</h3>
                                        <Badge className="bg-green-600">Готово</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{diet.notes}</p>
                                    <p className="text-xs text-muted-foreground">Создана: {formatRelativeTime(diet.createdOn)}</p>
                                </div>


                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button  onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }} variant="ghost">
                                            <MoreVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="flex flex-col p-4 gap-3">
                                            <Button
                                                variant="ghost"
                                                onClick={() =>  router.push(`/diet-view/${diet.dietId}`)}
                                                className="flex items-center gap-2 text-gray-700"
                                            >
                                                <TableConfigIcon size={18} /> Открыть
                                            </Button>

                                            <Button onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }} variant='ghost'>
                                                <EditDietDialog  diet={diet} onUpdated={() => getAllDiets()} />
                                            </Button>

                                            <Button onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }} variant='ghost'>
                                                <DeleteDietAlert dietId={diet.dietId} />
                                            </Button>


                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

    ))}
</div>
)}
</section>
            </>}


            <FloatingAssistant/>

        </div>
    );
};

export default DashboardPage;
