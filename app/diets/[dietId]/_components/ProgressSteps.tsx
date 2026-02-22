
import { Badge } from "@/components/ui/badge";
import {useAuth} from "@/app/context/useAuth";

const steps = ["Цель", "Тело", "Тип питания", "КБЖУ", "Уже ели", "Аллергии", "Gemini", "Готово"];

export default function ProgressSteps({ currentStep }: { currentStep: number }) {
    const {user} =useAuth()
    return (
        <div className="flex justify-between flex-wrap items-center gap-4">
            {steps.map((title, i) => {
                const stepNumber = i + 1;
                return title ==='Gemini' && user?.tariff !== 'free' ? null : (
                    <div key={title} className="flex flex-col items-center gap-1">
                        <Badge
                            variant={currentStep === stepNumber ? "default" : "secondary"}
                        >

                                {stepNumber}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {title ==='Gemini' && user?.tariff !== 'free' ? '' : title}
                            </span>
                    </div>
                );
            })}
        </div>
    );
}
