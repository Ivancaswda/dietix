"use client"
import React, {useEffect, useState} from 'react'
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
import axios from "axios";

const DietIdPage = () => {
    const {dietId} = useParams()
    const [step, setStep] = useState(1);


    const back = () => setStep((s) => s - 1);
    const [draft, setDraft] = useState<any>({});
    useEffect(() => {
        const loadDraft = async () => {
            try {
                const res = await axios.get(`/api/diets/getOne?dietId=${dietId}`);
                if (res.data) {
                    setDraft(res.data.diet[0]);
                }
            } catch (e) {
                console.error("load draft error");
            }
        };

        loadDraft();
    }, [dietId]);

    const updateDraft = async (data: Record<string, any>) => {

        setDraft((prev) => ({
            ...prev,
            ...data,
        }));
        await axios.post('/api/diets/save', {data: data, dietId: dietId})
    };
    console.log('draft===', draft)

    return (
        <div>
            <div className="max-w-4xl flex flex-col gap-4 mx-auto p-6 space-y-6">
                <DietBreadcrumbs setStep={setStep} step={step}/>
                <ProgressSteps currentStep={step} />

                {step === 1 && <GoalStep draft={draft} onNext={(goal) => {
                    updateDraft({ goal })
                    setStep(2)
                }} />}
                {step === 2 && (
                    <BodyParamsStep
                        draft={draft}
                        onBack={back}
                        onNext={(data) => {
                            updateDraft(data);
                            setStep(3);
                        }}
                    />
                )}
                {step === 3 && <DietTypeStep draft={draft} onNext={(dietType) => {
                    updateDraft({dietType})
                    setStep(4)
                }} onBack={back} />}
                {step === 4 && <MacrosStep draft={draft}   onNext={(data) => {
                    updateDraft(data);
                    setStep(5);
                }} onBack={back} />}
                {step === 5 && <DietDiaryCard draft={draft}   onNext={(data) => {
                    updateDraft(data);
                    setStep(6);
                }} onBack={back} />}
                {step === 6 && <DietRestrictionsCard draft={draft}   onNext={(data) => {
                    updateDraft(data);
                    setStep(7);
                }} onBack={back} />}
                {step === 7 && (
                    <ApiKeyStep draft={draft}
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
