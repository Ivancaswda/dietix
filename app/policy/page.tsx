export default function PolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
            <h1 className="text-3xl font-bold">Политика конфиденциальности</h1>
            <p className="text-sm text-muted-foreground">
                Последнее обновление: 8 февраля 2026
            </p>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. Общие положения</h2>
                <p>
                    Диетикс уважает конфиденциальность пользователей и обязуется защищать
                    персональные данные, которые вы предоставляете при использовании сервиса.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">2. Какие данные мы собираем</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Имя пользователя</li>
                    <li>Email</li>
                    <li>Данные аккаунта</li>
                    <li>История взаимодействий с AI</li>
                    <li>Технические данные (IP, браузер, устройство)</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">3. Использование данных</h2>
                <p>
                    Мы используем данные для предоставления и улучшения сервиса,
                    персонализации рекомендаций, аналитики и поддержки пользователей.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">4. Искусственный интеллект</h2>
                <p>
                    Сообщения, отправленные AI-ассистенту, могут сохраняться для улучшения
                    качества сервиса. Мы не продаём персональные данные третьим лицам.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">5. Cookies</h2>
                <p>
                    Мы используем cookies для авторизации, аналитики и улучшения
                    пользовательского опыта.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">6. Права пользователя</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Доступ к своим данным</li>
                    <li>Исправление данных</li>
                    <li>Удаление аккаунта</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">7. Контакты</h2>
                <p>
                    По вопросам конфиденциальности:{" "}
                    <span className="font-medium">support@dietix.ai</span>
                </p>
            </section>
        </div>
    );
}
