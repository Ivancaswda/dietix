"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import { useAuth } from "@/app/context/useAuth";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaBowlFood } from "react-icons/fa6";
import { ChartAreaDiets } from "@/components/ChartAreaDiets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {uploadProfileImage} from "@/app/lib/imagekit";
import {StarIcon, UploadCloud} from "lucide-react";
import TariffBanner from "@/components/TariffBanner";
import {LoaderOne} from "@/components/ui/loader";

type Diet = {
    dietId: string;
    createdOn: string;
    isConfigured: boolean;
};

const ProfilePage = () => {
    const {  logout, } = useAuth();
    const fileInputRef = useRef()
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(false);
    const [diets, setDiets] = useState<Diet[]>([]);
    const [user, setUser] = useState<any>()
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await axios.get("/api/diets/getAll");
            setDiets(data.diets ?? []);
        };
        load();
    }, []);
    const getUser= async () => {
        const {data} = await axios.get('/api/auth/user')
        setUser(data.user)
    }
    useEffect(() => {

        getUser()
    }, []);

    useEffect(() => {
        if (user) {
            setName(user.userName || "");
            setEmail(user.email || "");
            setAvatarUrl(user.avatarUrl || "");
        }
    }, [user]);

    const stats = useMemo(() => {
        const total = diets.length;
        const active = diets.filter((d) => d.isConfigured).length;
        const drafts = total - active;

        return { total, active, drafts };
    }, [diets]);

    const saveProfile = async () => {
        try {
            setSaving(true);
            let imageUrl = ''
            if (imageFile) {
                const uploaded = await uploadProfileImage(imageFile);
                imageUrl = uploaded.url;
            }
            await axios.post("/api/update-profile", {
                name,
                email,
                avatarUrl:imageUrl,
            });

            toast.success("Профиль обновлён");
            setOpen(false);
            await getUser()
        } catch (e) {
            toast.error("Ошибка обновления профиля");
        } finally {
            setSaving(false);
        }
    };
    if (!user) {
        return <div className='flex items-center justify-center w-screen h-screen'>
            <LoaderOne/>
        </div>
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Профиль</CardTitle>

                    <Dialog  open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Редактировать</Button>
                        </DialogTrigger>

                        <DialogContent style={{maxWidth: '500px'}} className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Редактировать профиль</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label>Имя</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input disabled={true}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Фото Профиля</Label>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setImageFile(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }}
                                    />

                                    {/* кликабельная зона */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 transition hover:border-primary hover:bg-neutral-100"
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{height: '100px', width: '100px'}}
                                                className=" rounded-xl object-cover"
                                            />
                                        ) : (
                                            <>
                                                <UploadCloud className="h-8 w-8 mb-2" />
                                                <span className="text-sm text-center">
          Загрузить фото
        </span>
                                            </>
                                        )}
                                    </div>
                                </div>



                                <Button
                                    className="w-full"
                                    onClick={saveProfile}
                                    disabled={saving}
                                >
                                    {saving ? "Сохранение..." : "Сохранить"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent className="space-y-2 flex items-center justify-center flex-col">
                    <Avatar className="w-[120px] h-[120px]">
                        <AvatarImage className='object-cover' src={user?.avatarUrl} />
                        <AvatarFallback className="w-[120px] h-[120px] text-3xl bg-primary text-white font-semibold">
                            {user?.userName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <p>
                        <strong>Имя:</strong> {user?.userName ?? "—"}
                    </p>
                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>
                    <Button
                        size="lg"
                        className="cursor-pointer hover:bg-red-700 py-6"
                        variant="destructive"
                        onClick={() => {
                            toast.success("Вы успешно вышли!");
                            logout();
                        }}
                    >
                        Выйти из аккаунта
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-center items-center w-full gap-4">
                <StatCard title="Всего диет" value={stats.total} />
                <StatCard title="Активные" value={stats.active} variant="success" />
                <StatCard title="Черновики" value={stats.drafts} variant="secondary" />
                <Card className="w-full">
                    <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-muted-foreground">Звезды</p>
                        <div className="flex items-center bg- gap-2">
                            <Badge variant={ "destructive"} className="text-lg">
                            <StarIcon />

                                {user?.credits}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <TariffBanner/>

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
        <Card className="w-full">
            <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className="flex items-center gap-2">
                    <Badge variant={variant ?? "default"} className="text-lg">
                    <FaBowlFood />

                        {value}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
