"use client"
import React from "react"
import {FaBowlRice, FaUserDoctor} from "react-icons/fa6";
import {FaBrain, FaCalendar, FaMicrophone, FaRobot} from "react-icons/fa";
import {DietCards} from "@/components/DietCards";
import {InfoDietCarousel} from "@/components/InfoDietCarousel";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import FeatureCards from "@/components/FeatureCards";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import FAQ from "@/components/FAQ";
import FloatingAssistant from "@/components/FloatingAssistant";

const HomePage = () => {
    return (
        <div className='relative' style={{backgroundColor: '#edffea'}} >

            <section className="relative h-screen w-full overflow-hidden">

                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/video-hero.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />


                <div className="absolute inset-0 bg-black/50" />


                <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
                    <h1 className="text-white text-4xl md:text-6xl xl:text-7xl font-manrope font-bold max-w-4xl leading-tight">
                        Персональная диета от ИИ
                        <br />
                        <span className='text-primary'>
                    под твои цели и тело</span>
                    </h1>
                </div>


            </section>
            <section id="how" className="py-32 px-6 relative min-h-screen">
                <div className="absolute hidden lg:block z-20  h-[500px] w-[500px] bg-primary blur-[140px] rounded-full -top-40 -left-40" />
                <div className="absolute hidden lg:block z-20 h-[400px] w-[400px] bg-primary blur-[140px] rounded-full top-4 right-10" />

                <div className="max-w-6xl mx-auto text-center mb-20">
                    <FaBowlRice className="mx-auto mb-4 text-primary" />
                    <h2 className="text-5xl font-bold  mb-6">
                        Как работает <span className="text-primary">Диетикс</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Всего три шага к здоровой улыбке
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

                    {[
                        { title: "Задайте вопрос", icon: FaMicrophone },
                        { title: "Сгенерируйте ИИ-диету", icon: FaBowlRice },
                        { title: "Получите ИИ консультацию", icon: FaUserDoctor },
                    ].map((step, i) => (
                        <div key={i} className="rounded-3xl p-8 bg-card border hover:shadow-xl transition">
                            <step.icon style={{width: "60px", height: '60px'}} className="mx-auto mb-6 text-primary w-[90px]! h-[90px]!" />
                            <h3 className="text-2xl text-center font-semibold">{step.title}</h3>
                        </div>
                    ))}
                </div>
            </section>
            <DietCards/>
            <InfoDietCarousel/>
            <div className='px-2 sm:px-20'>
                <div   style={{marginTop: '80px', marginBottom: '20px'}} className="z-10 flex items-center justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20 mb-12 overflow-hidden">
                    <div className="space-y-4 ">
                        <div  className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-primary">
  Голосовой ассистент готов
</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                AI голосовой диетолог
                            </h1>
                            <p className="text-muted-foreground max-w-xl">
                                Общайтесь с AI-диетологом с помощью голоса.
                                Получайте мгновенные советы, рекомендации и помощь 24/7.
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                            <FaMicrophone className="w-16 h-16 text-primary" />
                        </div>
                    </div>
                </div>
                <FeatureCards/>
            </div>
            <FAQ/>



            <PricingSection/>
            <div className='w-full mb-20 flex items-center justify-center'>
                <Link href="/dashboard" >
                    <Button size='lg' className="px-6 py-6 cursor-pointer text-lg mx-auto hover:scale-105 transition-all" >
                        Начать сейчас
                    </Button>
                </Link>

            </div>
            <Footer/>
            <FloatingAssistant/>
        </div>

    )
}

export default HomePage
