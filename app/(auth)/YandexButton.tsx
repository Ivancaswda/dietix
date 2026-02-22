"use client";

import { Button } from "@/components/ui/button";
import { FaYandex } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {useAuth} from "@/app/context/useAuth";
import axios from "axios";

const YandexButton = () => {
    const router = useRouter();
    const {user, setUser} = useAuth()
    const handleLogin = async () => {
        const clientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID;

        const redirectUri = encodeURIComponent(
            "https://dietix-ru.vercel.app/api/auth/yandex/callback"
        );

        const scope = encodeURIComponent("login:email login:info");

        const url = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

        await loadUser();


    };
    const loadUser = async () => {
        try {
            const { data } = await axios.get("/api/auth/user");
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {

        }
    };


    return (
        <Button
            onClick={handleLogin}
            className="flex hover:scale-105 transition-all items-center gap-2 mt-4 bg-black text-white hover:bg-gray-800"
            type="button"
        >
            <FaYandex />
            Войти через Яндекс
        </Button>
    );
};

export default YandexButton;