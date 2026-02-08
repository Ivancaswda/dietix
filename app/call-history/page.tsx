"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {LoaderOne} from "@/components/ui/loader";
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {FoldersIcon, PhoneCallIcon, Trash2Icon} from "lucide-react";
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link";
import {toast} from "sonner";
export default function AIHistoryPage() {
    const [calls, setCalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await axios.get("/api/get-call-history");

                const sortedCalls = res.data.sort(
                    (a: any, b: any) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
                );
                setCalls(sortedCalls);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (loading) return <div className='flex h-screen w-screen items-center justify-center'>
        <LoaderOne/>
    </div>;

    if (!calls.length) return <div className='flex items-center justify-center '>

        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PhoneCallIcon />
                </EmptyMedia>
                <EmptyTitle>Пока нету историй звонков</EmptyTitle>
                <EmptyDescription>
                        Начните общаться с нашими Тикси ботом и вы увидите историю ваших звонков тут
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <Link href='/voice'>
                    <Button>Проконсультироваться с Тикси</Button>
                </Link>


            </EmptyContent>
            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="/about">
                    Изучить больше <ArrowUpRightIcon />
                </a>
            </Button>
        </Empty>
    </div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {calls.map((call) => {
                const handleDelete = async () => {

                    try {
                        await axios.delete("/api/delete-call-history", { data: { callId: call.id } });
                        toast.success('История звонка успещно удалена')
                        setCalls((prev) => prev.filter((c) => c.id !== call.id));
                    } catch (error) {
                        console.error(error);
                        toast.error("Не удалось удалить звонок");
                    }
                };

                return (
                    <Card key={call.id} className="p-4 bg-white shadow-md rounded-xl">
                        <div className='flex flex-col gap-4'>
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Ассистент: {call.assistantName}</h3>
                                <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {new Date(call.createdOn).toLocaleString()}
                        </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleDelete}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                            {call.messages.map((msg: any, idx: number) => {
                                const isAssistant = msg.role === "assistant";
                                return (
                                    <div
                                        key={idx}
                                        className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                                    >
                                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                                            isAssistant
                                                ? "bg-muted text-foreground rounded-tl-none"
                                                : "bg-primary text-white rounded-tr-none"
                                        }`}>
                                            <div className="text-[10px] opacity-70 mb-1 font-medium">
                                                {isAssistant ? "Тикси AI" : "Вы"}
                                            </div>
                                            <div>{msg.content}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
