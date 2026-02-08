import React from "react"
import Image from "next/image"
import {FaGithub, FaTelegram, FaVk, FaWhatsapp} from "react-icons/fa"
import { PhoneCallIcon } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-primary pt-20 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* BRAND */}
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Диетикс"
                                width={144}
                                height={144}
                                className="rounded-lg"
                            />

                        </div>

                        <p className="text-sm text-white leading-relaxed mb-6">
                            Умный сервис питания, где искусственный интеллект анализирует цели,
                            параметры тела и образ жизни, создавая персональную диету без шаблонов.
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-white transition">
                                <FaVk size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FaGithub size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FaWhatsapp size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FaTelegram size={20} />
                            </a>

                            <a href="#" className="hover:text-white transition">
                                <Image src="/ok.svg"  alt="ok" width={30} height={30}/>
                           </a>
                        </div>
                    </div>

                    {/* NAV */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Навигация</h3>
                        <ul className="space-y-2 text-white">
                            <li><a href="/dashboard" className="hover:text-white/80">Мои диеты</a></li>
                            <li><a href="/profile" className="hover:text-white/80">Профиль</a></li>
                            <li><a href="/pricing" className="hover:text-white/80">Тарифы</a></li>
                            <li><a href="/about" className="hover:text-white/80">О сервисе</a></li>
                        </ul>
                    </div>

                    {/* PRODUCT */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Продукт</h3>
                        <ul className="space-y-2 text-white">
                            <li><a href="/dashboard" className="hover:text-white/80">Создание диеты</a></li>
                            <li><a href="/pricing" className="hover:text-white/80">Подписка</a></li>
                            <li><a href="/profile" className="hover:text-white/80">Аккаунт</a></li>
                            <li><a href="#faq" className="hover:text-white/80">FAQ</a></li>
                        </ul>
                    </div>

                    {/* SUPPORT */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
                        <ul className="space-y-2 text-white mb-6">
                            <li><a href="#support" className="hover:text-white/80">Связаться с нами</a></li>
                            <li><a href="/policy" className="hover:text-white/80">Конфиденциальность</a></li>
                            <li><a href="/terms" className="hover:text-white/80">Условия использования</a></li>
                        </ul>

                        <div className="flex items-center gap-3 text-white text-sm">
                            <PhoneCallIcon size={16} />
                            <span>support@dietix.ru</span>
                        </div>
                    </div>

                </div>

                {/* BOTTOM */}
                <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm text-white/60">
                    © 2026 Диетикс. Все права защищены.
                </div>
            </div>
        </footer>
    )
}

export default Footer
