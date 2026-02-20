'use client'
import React, {useEffect, useState} from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader, SidebarProvider,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {ArrowUpRightIcon, EditIcon, LogOutIcon, MoreVertical, Stars, Trash2Icon, UserIcon} from "lucide-react";
import {FaCrow, FaCrown, FaFolder} from "react-icons/fa";

import {Progress} from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import axios from "axios";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";
import {useAuth} from "@/app/context/useAuth";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {FaBowlFood} from "react-icons/fa6";
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useDiets} from "@/app/context/DietsContext";

const SidebarComponent = ({ onClose }: { onClose?: () => void }) => {

    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const {user, logout, loading} = useAuth()
    const router = useRouter()
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false)
    const {diets, refreshDiets} = useDiets()
    const [pending, setPending] = useState<boolean>()
    const [Diets, setDiets]  = useState(diets || [])
    const getAllDiets = async () => {
        try {
            setPending(true)
            const {data} = await axios.get('/api/diets/getAll' )
            setDiets(data.diets)
            setPending(false)
        } catch (error) {
            setPending(false)
            toast.error('Не удалось получить диеты')
            console.log(error)
        }
    }
    const handleDietCreate = async () => {
        try {
            setIsCreating(true)

            const {data} = await axios.post('/api/diets/create', {name, desc})

            setIsCreating(false)
            router.push(`/diets/${data.diet.dietId}`)
            toast.success('Диета создана!')
        } catch (error) {
            console.log(error)
            toast.error('Не удалось создать диету!')
        }
    }
    useEffect(() => {
        user && getAllDiets()
    }, []);
    const handleDelete = async (dietId) => {
        try {
            setSkeletonLoading(true)
            const {data} =await axios.delete(`/api/diets/delete?dietId=${dietId}`)
            if (data.success) {

                toast.success('проект успешно удален')
                setSkeletonLoading(false)
                refreshDiets()
                router.replace("/dashboard");
                router.refresh()
            }

        } catch (error) {
            setSkeletonLoading(false)
            console.log(error)
            toast.error('Не удалось удалить проект')
        }
    }
    const creditsLeft = user?.credits ?? 0;


    const MAX_UI = 10;

    const percent = Math.min((creditsLeft / MAX_UI) * 100, 100);

    return (

        <Sidebar collapsible="none" className="h-screen mt-4 flex flex-col">
                <Dialog>

                    <DialogTrigger asChild>
                        <Button  className='w-full '>
                            + Добавить диету
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Создать новую диету</DialogTitle>
                            <DialogDescription>
                                Заполните минимальные данные чтобы начать пользоваться нашим серисом
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name-1">Название</Label>
                                <Input onChange={(e) => setName(e.target.value)} value={name} id="name-1" name="name" placeholder="Моя Первая Диета" />
                            </Field>
                            <Field>
                                <Label htmlFor="desc-1">Описание</Label>
                                <Input onChange={(e) => setDesc(e.target.value)} value={desc} id="desc-1" name="desc" placeholder="Диета для похудения в быстром сроке" />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Отменить</Button>
                            </DialogClose>
                            <Button disabled={isCreating} type="button" onClick={handleDietCreate}>
                                {isCreating ? 'Подождите...' : 'Создать диету'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            <SidebarContent className="flex flex-col h-full">

                <div className="flex-1 overflow-y-auto px-1">
                    <SidebarGroup>
                        {skeletonLoading ? (

                            [1, 2, 3, 4, 5].map((_, index) => (
                                <Skeleton key={index} className='h-10 w-full rounded-lg mt-2' />
                            ))
                        ) : diets?.length === 0 ? (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <FaFolder />
                                    </EmptyMedia>
                                    <EmptyTitle>Пока Нету диет</EmptyTitle>
                                </EmptyHeader>
                                <EmptyContent>
                                    Создайте диету нажав на кнопку ниже чтобы они тут появились!
                                </EmptyContent>
                            </Empty>
                        ) : (

                            diets.map((item: any, index: number) => (
                                <Link key={index}
                                    href={`/diet-view/${item.dietId}`}
                                    onClick={() => onClose?.()}
                                    className='my-2 hover:bg-gray-100 flex items-center justify-between  transition-all py-2 px-4 font-semibold rounded-lg cursor-pointer block'
                                >
                                    <h2 className='line-clamp-1 text-sm  '>
                                        {item?.name}
                                    </h2>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                            >
                                                <MoreVertical />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>

                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()

                                                }}
                                            >
                                                <EditIcon className="mr-2" />
                                                Изменить
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(item.dietId)
                                                }}
                                            >
                                                <Trash2Icon className="mr-2" />
                                                Удалить
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>



                                </Link>
                            ))
                        )}
                    </SidebarGroup>
                </div>

                <div className="p-3 border-t bg-secondary flex flex-col gap-4 mt-auto">
                        <div className='flex justify-between px-2 items-center gap-4'>
                            <p className='font-semibold'>Ваш тариф:</p>

                            <Button variant={user?.tariff ==='premium' ? 'secondary' : user?.tariff === 'basic' ? 'destructive' : 'outline'}>
                                {user?.tariff === 'premium' ? 'Премиум' : user?.tariff === 'basic' ? 'Basic' : 'Free'}
                            </Button>
                        </div>
                        <div className="px-2 space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span className='flex items-center gap-4'>Звезды <Stars className='size-4'/></span>
                                <span>{creditsLeft} осталось</span>
                            </div>

                            <Progress value={percent} className="h-2" />

                            {creditsLeft === 0 && (
                                <p className="text-xs text-primary">
                                    Звезды закончились
                                </p>
                            )}
                        </div>


                        <div className="flex items-center gap-3 mt-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar>
                                            <AvatarImage src={user?.avatarUrl}/>
                                            <AvatarFallback className='bg-primary text-white cursor-pointer'>
                                                {user?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user?.userName}</span>
                                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            onClick={() => onClose?.()} href="/profile" className="flex items-center gap-2">
                                            <UserIcon size={16} /> Профиль
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => logout()}
                                        className="text-red-600 flex items-center gap-2"
                                    >
                                        <LogOutIcon size={16} /> Выйти
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Link
                                onClick={() => onClose?.()} href='/pricing'>
                                <Button className='w-full flex items-center gap-2'>
                                    <FaCrown/> Обновить тариф
                                </Button>
                            </Link>
                        </div>
                    </div>
                </SidebarContent>


            </Sidebar>

    )
}
export default SidebarComponent
