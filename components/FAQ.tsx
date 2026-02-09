"use client"
import React from "react";
import { Disclosure } from "@headlessui/react";
import {ChevronDownIcon, ChevronUpIcon} from 'lucide-react'

const faqs = [
    {
        question: "Как работает сервис Диетикс?",
        answer: "Наш ИИ анализирует ваши цели, параметры тела и привычки, после чего формирует персональную диету, учитывая калории, микроэлементы и предпочтения в еде.",
    },
    {
        question: "Можно ли изменить диету после создания?",
        answer: "Да! Вы можете редактировать название, описание и цели диеты в любое время через панель управления.",
    },
    {
        question: "Сколько стоит пользование сервисом?",
        answer: "У нас есть бесплатный тариф с ограниченными возможностями (максимум 3 диеты), а также Basic (10 диет) и Premium тарифы с расширенными функциями и неограниченным доступом к диетам.",
    },
    {
        question: "Как ИИ подбирает рецепты?",
        answer: "ИИ учитывает ваши цели, пищевые предпочтения, аллергенные ограничения и составляет меню, которое подходит именно вам.",
    },
    {
        question: "Нужны ли  сервисы для пользования вашим сайтом?",
        answer: "Да, Если вы хотите использовать все функции нашего сайта то вам понадобиться api ключ Gemini и Vapi.",
    },
];

export default function FAQ() {
    return (
        <section id='faq' className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <Disclosure key={index} as="div" className="border rounded-lg">
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-left text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-primary">
                                    <span className="font-medium">{faq.question}</span>
                                    {open ?  <ChevronUpIcon
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 `}
                                    /> :  <ChevronDownIcon
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 `}
                                    />}

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 py-3 text-gray-700 bg-white">
                                    {faq.answer}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </section>
    );
}
