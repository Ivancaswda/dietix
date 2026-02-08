"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/context/useAuth";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaBowlFood } from "react-icons/fa6";
import { ChartAreaDiets } from "@/components/ChartAreaDiets";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

type Diet = {
    dietId: string;
    createdOn: string;
    isConfigured: boolean;
};

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [diets, setDiets] = useState<Diet[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await axios.get("/api/diets/getAll");
            setDiets(data.diets ?? []);
        };
        load();
    }, []);

    const stats = useMemo(() => {
        const total = diets.length;
        const active = diets.filter(d => d.isConfigured).length;
        const drafts = total - active;

        return { total, active, drafts };
    }, [diets]);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle>Профиль</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex items-center justify-center flex-col">
                    <Avatar className='w-[120px] h-[120px]'>
                        <AvatarImage src={user?.avatarUrl}/>
                        <AvatarFallback className='w-[120px] h-[120px] text-3xl bg-primary text-white font-semibold'>
                            {user?.userName[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <p><strong>Имя:</strong> {user?.userName ?? "—"}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <Button size='lg' className='cursor-pointer hover:bg-red-700 py-6' variant='destructive' onClick={() => {
                        toast.success('Вы успешно вышли!')
                        logout()
                    }}>
                        Выйти из аккаунта
                    </Button>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Всего диет" value={stats.total} />
                <StatCard title="Активные" value={stats.active} variant="success" />
                <StatCard title="Черновики" value={stats.drafts} variant="secondary" />
            </div>


            <ChartAreaDiets diets={diets} />
        </div>
    );
};

export default ProfilePage;

function StatCard({
                      title,
                      value,
                      variant,
                  }: {
    title: string;
    value: number;
    variant?: "success" | "secondary";
}) {
    return (
        <Card>
            <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className="flex items-center gap-2">
                    <FaBowlFood />
                    <Badge variant={variant ?? "default"} className="text-lg">
                        {value}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
