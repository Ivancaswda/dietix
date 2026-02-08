import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DietBreadcrumbs({
                                            step,setStep
                                        }: {
    step: number;
}) {
    const steps = [
        "Цель",
        "Параметры тела",
        "Тип питания",
        "КБЖУ",
        "Уже съедено",
        "Ограничения",
        "Gemini api ключ",
        "Завершение",
    ];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = step === stepNumber;

                    return (
                        <div key={label} onClick={() => setStep(stepNumber)} className="flex items-center">
                            <BreadcrumbItem>
                                {isActive ? (
                                    <BreadcrumbPage className='text-primary font-semibold'>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink className="cursor-default text-muted-foreground">
                                        {label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {index < steps.length - 1 && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}