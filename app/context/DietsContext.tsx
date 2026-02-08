// app/context/DietsContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

type DietType = any; // Подставь тип диеты

interface DietsContextType {
    diets: DietType[];
    refreshDiets: () => void;
    setDiets: React.Dispatch<React.SetStateAction<DietType[]>>;
}

const DietsContext = createContext<DietsContextType | undefined>(undefined);

export const DietsProvider = ({ children }: { children: ReactNode }) => {
    const [diets, setDiets] = useState<DietType[]>([]);

    const refreshDiets = async () => {
        try {
            const { data } = await axios.get("/api/diets/getAll");
            setDiets(data.diets ?? []);
        } catch (err) {
            console.log(err);
            toast.error("Не удалось загрузить диеты");
        }
    };

    useEffect(() => {
        refreshDiets();
    }, []);

    return (
        <DietsContext.Provider value={{ diets, refreshDiets, setDiets }}>
            {children}
        </DietsContext.Provider>
    );
};

export const useDiets = () => {
    const context = useContext(DietsContext);
    if (!context) throw new Error("useDiets must be used within a DietsProvider");
    return context;
};
