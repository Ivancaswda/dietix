"use client"
import React, {useState} from 'react'
import {useParams} from "next/navigation";
import ProgressSteps from "@/app/diets/[dietId]/_components/ProgressSteps";
import GoalStep from "@/app/diets/[dietId]/_components/GoalStep";
import BodyParamsStep from "@/app/diets/[dietId]/_components/BodyParamsStep";
import DietTypeStep from "@/app/diets/[dietId]/_components/DietTypeStep";
import MacrosStep from "@/app/diets/[dietId]/_components/MacrosStep";
import FinishStep from "@/app/diets/[dietId]/_components/FinishStep";
import DietBreadcrumbs from "@/app/diets/[dietId]/_components/DietBreadcrumbs";
import ApiKeyStep from "@/app/diets/[dietId]/_components/ApiKeyStep";
import {DietDiaryCard} from "@/app/diets/[dietId]/_components/DietDiaryCard";
import {DietRestrictionsCard} from "@/app/diets/[dietId]/_components/DietRestrictionsCard";

const DietIdPage = () => {
    const {dietId} = useParams()
    const [step, setStep] = useState(1);


    const back = () => setStep((s) => s - 1);
    const [draft, setDraft] = useState<any>({});

    const updateDraft = (data: Record<string, any>) => {
        setDraft((prev) => ({
            ...prev,
            ...data,
        }));
    };

    return (
        <div>
            <div className="max-w-4xl flex flex-col gap-4 mx-auto p-6 space-y-6">
                <DietBreadcrumbs setStep={setStep} step={step}/>
                <ProgressSteps currentStep={step} />

                {step === 1 && <GoalStep onNext={(goal) => {
                    updateDraft({ goal })
                    setStep(2)
                }} />}
                {step === 2 && (
                    <BodyParamsStep
                        onBack={back}
                        onNext={(data) => {
                            updateDraft(data);
                            setStep(3);
                        }}
                    />
                )}
                {step === 3 && <DietTypeStep onNext={(dietType) => {
                    updateDraft({dietType})
                    setStep(4)
                }} onBack={back} />}
                {step === 4 && <MacrosStep   onNext={(data) => {
                    updateDraft(data);
                    setStep(5);
                }} onBack={back} />}
                {step === 5 && <DietDiaryCard   onNext={(data) => {
                    updateDraft(data);
                    setStep(6);
                }} onBack={back} />}
                {step === 6 && <DietRestrictionsCard   onNext={(data) => {
                    updateDraft(data);
                    setStep(7);
                }} onBack={back} />}
                {step === 7 && (
                    <ApiKeyStep
                        onNext={(apiKey) => {
                            updateDraft({ apiKey });
                            setStep(8);
                        }}
                        onBack={back}
                    />
                )}
                {step === 8 && <FinishStep data={draft} dietId={dietId} onBack={() => setStep(5)} />}
            </div>
        </div>
    )
}
export default DietIdPage
