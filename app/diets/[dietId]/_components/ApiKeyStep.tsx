import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ApiKeyStep({
                                       onNext,
                                       onBack,
    draft
                                   }: {
    onNext: (apiKey: string) => void;
    onBack: () => void;
    draft:any
}) {
    const [apiKey, setApiKey] = useState(draft.apiKey ??"");
    const isValid = apiKey.trim().length > 20;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 space-y-8">

                <div className="text-center space-y-2 mb-4">
                    <div className="flex justify-center">
                        <div className="p-3 rounded-full bg-muted">
                            <KeyRound className="h-6 w-6" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold">
                        Gemini API ключ
                    </h2>

                    <p className="text-muted-foreground">
                        Ключ используется только для генерации вашего плана питания
                    </p>
                </div>


                <div className="space-y-4 py-6">
                    <div className="rounded-2xl border p-4 space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">
                            Введите API ключ
                        </label>

                        <Input
                            type="password"
                            placeholder="AIzaSy..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            Ключ не сохраняется и не передаётся третьим лицам
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Получить ключ можно в{" "}
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            className="underline underline-offset-4"
                        >
                            Google AI Studio
                        </a>
                    </p>
                </div>


                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад
                    </Button>

                    <Button
                        size="lg"
                        disabled={!isValid}
                        onClick={() => onNext(apiKey.trim())}
                    >
                        Сгенерировать рацион
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
