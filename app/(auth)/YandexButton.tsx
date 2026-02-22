"use client";

import { Button } from "@/components/ui/button";
import { FaYandex } from "react-icons/fa";
import { useRouter } from "next/navigation";

const YandexButton = () => {
    const router = useRouter();

    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID;

        const redirectUri = encodeURIComponent(
            "http://localhost:3000/api/auth/yandex/callback"
        );

        const url = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

        window.location.href = url;
    };

    return (
        <Button
            onClick={handleLogin}
            className="flex items-center gap-2 mt-4 bg-black text-white hover:bg-gray-800"
            type="button"
        >
            <FaYandex />
            Войти через Яндекс
        </Button>
    );
};

export default YandexButton;