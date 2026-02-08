export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
            <h1 className="text-3xl font-bold">Условия использования</h1>
            <p className="text-sm text-muted-foreground">
                Последнее обновление: 8 февраля 2026
            </p>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. О сервисе</h2>
                <p>
                    Диетикс — это платформа с AI-инструментами для составления рекомендаций
                    по питанию. Сервис не является медицинской услугой.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">2. Регистрация</h2>
                <p>
                    Для доступа к функциям сервиса может потребоваться регистрация.
                    Пользователь несёт ответственность за сохранность данных аккаунта.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">3. Использование сервиса</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Запрещено использовать сервис в незаконных целях</li>
                    <li>Запрещены попытки взлома и злоупотребления</li>
                    <li>Запрещён автоматический спам-запрос</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">4. AI-рекомендации</h2>
                <p>
                    Все рекомендации носят информационный характер. Диетикс не гарантирует
                    точность или применимость советов для каждого пользователя.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">5. Ограничение ответственности</h2>
                <p>
                    Диетикс не несёт ответственности за решения, принятые пользователем на
                    основе рекомендаций сервиса.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">6. Изменения условий</h2>
                <p>
                    Мы можем обновлять условия использования. Актуальная версия всегда
                    доступна на сайте.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">7. Контакты</h2>
                <p>
                    Связаться с нами:{" "}
                    <span className="font-medium">support@dietix.ai</span>
                </p>
            </section>
        </div>
    );
}
