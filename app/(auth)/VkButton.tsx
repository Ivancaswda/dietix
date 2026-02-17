"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
    interface Window {
        VKIDSDK: any;
    }
}

const VkButton = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.VKIDSDK || !containerRef.current) return;

        const VKID = window.VKIDSDK;

        VKID.Config.init({
            app: 54456526,
            redirectUrl: "https://dietix-ru.vercel.app/api/auth/vk/callback",
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: "",
        });

        const oneTap = new VKID.OneTap();

        oneTap
            .render({
                container: containerRef.current,
                showAlternativeLogin: true,
                styles: {
                    borderRadius: 10,
                    height: 40,
                },
            })
            .on(VKID.WidgetEvents.ERROR, (e: any) => {
                console.error("VK error", e);
            })
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload: any) => {
                try {
                    const { code, device_id } = payload;

                    const data = await VKID.Auth.exchangeCode(code, device_id);

                    console.log("VK SUCCESS", data);


                    await fetch("/api/auth/vk", {
                        method: "POST",
                        body: JSON.stringify(data),
                    });
                } catch (e) {
                    console.error("VK auth error", e);
                }
            });
    }, []);

    return (
        <div className='mt-4'>

            <Script
                src="https://unpkg.com/@vkid/sdk@2/dist-sdk/umd/index.js"
                strategy="afterInteractive"
            />

            {/* Контейнер кнопки */}
            <div ref={containerRef} />
        </div>
    );
};

export default VkButton;
