'use client'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {toast} from "sonner";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/app/context/useAuth";
import {FaPersonCircleCheck, FaUserDoctor} from "react-icons/fa6";
import axios from "axios";

const FloatingAssistant = () => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)
    const {user} = useAuth()
    const [aiLoading, setAiLoading] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [input, setInput] = useState('')
    const [supportInput, setSupportInput] = useState('')
    const [supportMode, setSupportMode] = useState(false)
    const [email, setEmail] = useState('')
    const [messages, setMessages] = useState<
        { role: 'user' | 'assistant'; content: string }[]
    >([
        {
            role: 'assistant',
            content: 'Привет 👋 Я AI-ассистент Диетикс. Чем могу помочь?',
        },
    ])
    console.log('suuportInput', supportInput)


    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true)
        }, 8000)

        return () => clearTimeout(timer)
    }, [])


    const sendMessage = async () => {
        try {
            if (!input.trim()) return

            const newMessages = [
                ...messages,
                { role: 'user', content: input },
            ]

            setMessages(newMessages)
            setInput('')
            setAiLoading(true)

            const res = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                }),
            })

            const data = await res.json()

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.content },
            ])
        } catch (error) {
            console.log(error)
            toast.error('Не удалось отправить сообщение!')
        } finally {
            setAiLoading(false)
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [messages])

    return (
        <div id='support'>

            <motion.button
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
            >
                <MessageCircle />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-24 right-6 z-50 w-[340px] rounded-2xl border bg-background shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                            <div className="font-semibold flex items-center gap-2" >
                              <FaUserDoctor className='text-primary'/>

                                 AI-ассистент
                            </div>
                            <button onClick={() => setOpen(false)}>
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>


                        <div className="h-64 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${
                                        msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    } gap-2`}
                                >
                                    <Avatar className="bg-primary text-white">
                                        <AvatarImage
                                            src={
                                                msg.role === 'user'
                                                    ? user?.avatarUrl
                                                    : '/logo.png'
                                            }
                                        />
                                        <AvatarFallback className='bg-primary text-white'>
                                            {msg.role === 'user'
                                                ? user?.userName?.[0]?.toUpperCase()
                                                : 'AI'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div
                                        className={`text-sm rounded-lg px-3 py-2 max-w-[85%] ${
                                            msg.role === 'user'
                                                ? 'ml-auto bg-primary text-white'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}


                            {aiLoading && (
                                <div className="flex gap-2">
                                    <Avatar className="bg-primary text-white">
                                        <AvatarImage src="/logo.png" />
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>

                                    <div className="text-sm rounded-lg px-3 py-2 bg-muted flex items-center gap-1">
                                        <span className="animate-pulse">Диетикс думает</span>
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-100">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>


                        <div className="p-3 border-t flex gap-2 items-center justify-between">
                            <Input
                                placeholder="Задайте вопрос..."
                                value={input}
                                className='w-full'
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') sendMessage()
                                }}
                            />
                            <Button size="icon" onClick={sendMessage}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>


                        <div className="p-3 border-t bg-muted/40">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setSupportMode(true)}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Связаться с поддержкой
                            </Button>
                        </div>
                        {supportMode && (
                            <div className="p-3 space-y-2">
                                <Input
                                    placeholder="Ваш email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Textarea
                                    placeholder="Сообщение..."
                                    value={supportInput}
                                    required={true}
                                    className='w-full'
                                    onChange={(e) => setSupportInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') sendMessage()
                                    }}
                                />
                                <Button disabled={loading}
                                    className="w-full"
                                    onClick={async () => {
                                        try {
                                            setLoading(true)
                                            const res =await axios.post('/api/support', {
                                                    email,
                                                    message: supportInput,
                                            })
                                            const data =res.data
                                            if (data.success) {
                                                setSupportMode(false)
                                                setMessages((prev) => [
                                                    ...prev,
                                                    {
                                                        role: 'assistant',
                                                        content:
                                                            'Спасибо! Мы получили сообщение и скоро ответим 🙌',
                                                    },
                                                ])

                                            }


                                            setLoading(false)
                                            setSupportInput('')
                                        } catch (err) {
                                            setLoading(false)
                                            toast.error('Не удалось отправить письмо, выключите впн!')
                                            console.log(err)
                                        }

                                    }}
                                >
                                    {loading? 'Подождите...' : 'Отправить'}

                                </Button>

                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FloatingAssistant

