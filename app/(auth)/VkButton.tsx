"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import {useAuth} from "@/app/context/useAuth";

declare global {
    interface Window {
        VKIDSDK: any;
    }
}

const VkButton = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {user, setUser} = useAuth()
    useEffect(() => {
        if (!window.VKIDSDK || !containerRef.current) return;

        const VKID = window.VKIDSDK;

        VKID.Config.init({
            app: 54456526,
            redirectUrl: window.location.origin,
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: "email", // если нужно
        });

        const oneTap = new VKID.OneTap();

        oneTap
            .render({
                container: containerRef.current,
                showAlternativeLogin: true,
            })
            .on(VKID.WidgetEvents.ERROR, (e: any) => {
                console.error("VK ERROR:", e);
            })
            .on(
                VKID.OneTapInternalEvents.LOGIN_SUCCESS,
                async (payload: any) => {
                    try {
                        const { code, device_id } = payload;


                        const tokenData = await VKID.Auth.exchangeCode(
                            code,
                            device_id
                        );

                        /*
                          tokenData содержит:
                          access_token
                          refresh_token
                          id_token
                          user_id
                          expires_in
                        */

                        console.log("VK TOKEN DATA:", tokenData);

                        // 👉 отправляем в свой API
                        const res = await fetch("/api/auth/vk", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                access_token: tokenData.access_token,
                                user_id: tokenData.user_id,
                                id_token: tokenData.id_token,
                            }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                            throw new Error(data.error);
                        }

                        console.log("VK LOGIN SUCCESS", data);

                        setUser(data.user)
                    } catch (e) {
                        console.error("VK AUTH ERROR:", e);
                    }
                }
            );
    }, []);

    return (
        <div className="mt-4">
            <Script
                src="https://unpkg.com/@vkid/sdk@2/dist-sdk/umd/index.js"
                strategy="afterInteractive"
            />
            <div ref={containerRef} />
        </div>
    );
};

export default VkButton;
