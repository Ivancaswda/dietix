
import { Badge } from "@/components/ui/badge";

const steps = ["Цель", "Тело", "Тип питания", "КБЖУ", "Уже ели", "Аллергии", "Gemini", "Готово"];

export default function ProgressSteps({ currentStep }: { currentStep: number }) {
    return (
        <div className="flex justify-between">
            {steps.map((title, i) => {
                const stepNumber = i + 1;
                return (
                    <div key={title} className="flex flex-col items-center gap-1">
                        <Badge
                            variant={currentStep === stepNumber ? "default" : "secondary"}
                        >
                            {stepNumber}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{title}</span>
                    </div>
                );
            })}
        </div>
    );
}
