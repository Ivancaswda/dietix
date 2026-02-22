"use client";

import { useEffect, useRef, useState } from "react";
import { Card} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useAuth} from "@/app/context/useAuth";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaBrain} from "react-icons/fa";
import VapiApiKeyDialog from "@/components/VapiApiKeyDialog";
import Vapi from "@vapi-ai/web";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import axios from "axios";
import {v4 as uuidv4} from 'uuid'

const getCallLimit = (user: any) => {
  if (!user) return 0;

  if (user.tariff === "premium") return Infinity;
  if (user.tariff === "basic") return 5;

  return 1;
};
function VapiWidget() {
  const [showDialog, setShowDialog] = useState(false);
  const [vapiClient, setVapiClient] = useState<Vapi | null>(null);
  const messagesRef = useRef<any[]>([]);
  const router =useRouter()
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const visibleMessages = messages.slice(-8);
  const { user, loading, callCount, setCallCount } = useAuth();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const callLimit = getCallLimit(user);
  const callsUsed = user?.aiCallCount ?? 0 ;

  const limitReached = callsUsed <= 0;
  console.log(user)
  console.log('callCount===', callCount)
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const updateCallCount = async () => {
    try {
      const newCount = user?.aiCallCount - 1;

      await axios.post("/api/update-call-count", {aiCallCount: newCount });

    } catch (error) {
      toast.error('Не удалось обновить кол-во звонков')
      console.log(error)
    }
  }

  useEffect(() => {
    if (!vapiClient) return;

    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };
    console.log('messages===')
    console.log(messages)
    const handleCallEnd = async () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);

    const callId = uuidv4()

      if (user?.tariff !== "premium") {
        await updateCallCount(); // ✅ ТУТ
      }

      try {
        await axios.post("/api/save-call-history", {
          assistantName: "Тикси AI",
          messages: messagesRef.current,
          callId: callId
        });
      } catch (error) {
        toast.error('Не удалось сохранить историю сообщений звонка!')
        console.error("Failed to save AI call history", error);
      }

    };


    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMsg = { content: message.transcript, role: message.role };
        messagesRef.current.push(newMsg);
        setMessages([...messagesRef.current]); // чтобы UI обновился
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      toast.error('Ошибка VAPI!')
      setConnecting(false);
      setCallActive(false);
    };

    vapiClient
        .on("call-start", handleCallStart)
        .on("call-end", handleCallEnd)
        .on("speech-start", handleSpeechStart)
        .on("speech-end", handleSpeechEnd)
        .on("message", handleMessage)
        .on("error", handleError);

    return () => {
      vapiClient
          .off("call-start", handleCallStart)
          .off("call-end", handleCallEnd)
          .off("speech-start", handleSpeechStart)
          .off("speech-end", handleSpeechEnd)
          .off("message", handleMessage)
          .off("error", handleError);
    };
  }, [vapiClient]);

  const toggleCall = async () => {
    if (callActive && vapiClient) {
      vapiClient.stop();
      return;
    }


    if (!vapiClient) {
      setShowDialog(true);
      return;
    }


    if (limitReached) {
      toast.error("Вы исчерпали лимит звонков на этом тарифе");

      if (user?.tariff !== "premium") {
        router.replace("/pricing");
      }

      return;
    }


    try {

      setConnecting(true);
      setMessages([]);
      setCallEnded(false);

      setShowDialog(true);

      setConnecting(false);
    } catch (error) {
      console.log("Failed to start call", error);
      setConnecting(false);
    }
  };
  console.log('limitReached', limitReached)
  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 flex flex-col overflow-hidden pb-20 "
    style={{marginTop: '120px'}}
    >

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-mono">
          <span className='text-4xl'>Поговорите с вашим </span>
          <span className="text-primary uppercase text-4xl">AI Диетологом</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Голосовое общение с AI-ассистентом для консультаций и советов
        </p>
      </div>



      <div className="flex flex-wrap items-center justify-center  gap-6 mb-12">


        <Card style={{width: '400px', height: '250px'}} className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
          <div className="aspect-video flex flex-col items-center justify-center p-6 relative">

            <div
              className={`absolute inset-0 ${
                isSpeaking ? "opacity-30" : "opacity-0"
              } transition-opacity duration-300`}
            >
              {/* voice wave animation when speaking */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                      isSpeaking ? "animate-sound-wave" : ""
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* AI LOGO */}
            <div className="relative size-32 mb-4">
              <div
                className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                  isSpeaking ? "animate-pulse" : ""
                }`}
              />

              <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5"></div>
                <FaBrain style={{width: '80px', height: '80px'}} className='text-primary'/>
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">Тикси AI</h2>
            <p className="text-sm text-muted-foreground mt-1">Диетолог-ассистент</p>

            {/* SPEAKING INDICATOR */}
            <div
              className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                isSpeaking ? "border-primary" : ""
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                }`}
              />

              <span className="text-xs text-muted-foreground">
               {isSpeaking
                   ? "Говорит..."
                   : callActive
                       ? "Слушает..."
                       : callEnded
                           ? "Звонок завершён"
                           : "Ожидание..."}
              </span>
            </div>
          </div>
        </Card>


        <Card style={{width: '400px', height: '250px'}} className={`bg-card/90   backdrop-blur-sm border overflow-hidden relative`}>
          <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-2 ring-primary/20">
              <Avatar className="w-full h-full">
                <AvatarImage
                    src={user?.avatarUrl}
                    className="w-full h-full object-cover"
                />
                <AvatarFallback className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-semibold">
                  {user?.userName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <h2 className="text-xl font-bold text-foreground">Вы</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user ? (user.userName).trim() : "Гость"}
            </p>

            {/* User Ready Text */}
            <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}>
              <div className={`w-2 h-2 rounded-full bg-muted`} />
              <span className="text-xs text-muted-foreground">Готов</span>
            </div>
          </div>
        </Card>
      </div>


      {visibleMessages.length > 0 && (
          <div
              ref={messageContainerRef}
              className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-md border border-border rounded-2xl p-4 mb-8 h-64 overflow-y-auto scroll-smooth shadow-lg"
          >
            <div className="flex flex-col gap-3">
              {visibleMessages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";

                return (
                    <div
                        key={index}
                        className={`flex ${
                            isAssistant ? "justify-start" : "justify-end"
                        } animate-in fade-in slide-in-from-bottom-1 duration-300`}
                    >
                      <div
                          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm
                ${
                              isAssistant
                                  ? "bg-muted text-foreground rounded-bl-sm"
                                  : "bg-primary text-white rounded-br-sm"
                          }
              `}
                      >
                        <div className="text-[10px] opacity-60 mb-1">
                          {isAssistant ? "Тикси AI" : "Вы"}
                        </div>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                );
              })}

              {callEnded && (
                  <div className="flex justify-center animate-in fade-in duration-300">
                    <div className="text-xs text-muted-foreground italic mt-2">
                      Звонок завершён. Спасибо, что воспользовались Тикси от Диетикс AI 💚
                    </div>
                  </div>
              )}
            </div>
          </div>
      )}

      {/* CALL CONTROLS */}
      <div className="w-full flex justify-center gap-4">
        <Button
          className={`w-44 py-6 px-8 mb-4 text-xl rounded-3xl ${
            callActive
              ? "bg-destructive hover:bg-destructive/90"
              : callEnded
              ? "bg-red-500 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } text-white relative`}
          onClick={toggleCall}
          disabled={connecting || callEnded || limitReached}
        >
          {connecting && (
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
          )}

          <span>
           {callActive
               ? "Завершить"
               : connecting
                   ? "Подключение..."
                   : callEnded
                       ? "Завершено"
                       : "Начать разговор"}

          </span>
        </Button>

      </div>
      <p className="text-muted-foreground text-center mt-1 text-sm">
        {limitReached && user?.tariff === "free" && "Пробный звонок уже использован"}
        {limitReached && user?.tariff === "basic" && "Ваш лимит тарифа Basic исчерпан"}
      </p>
      <VapiApiKeyDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={async (key, assistantId) => {
            const client = new Vapi(key);

            setVapiClient(client);


            setShowDialog(false);
            setConnecting(true);
            setMessages([]);
            setCallEnded(false);

            try {
              await client.start(assistantId);
            } catch (e) {
              toast.error("Не удалось начать звонок");
              setConnecting(false);
            }
          }}
      />

    </div>
  );
}

export default VapiWidget;
