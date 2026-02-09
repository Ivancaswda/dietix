'use client'
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

type DietType = any;

interface DietsContextType {
    diets: DietType[];
    refreshDiets: () => void;
    setDiets: React.Dispatch<React.SetStateAction<DietType[]>>;
}

const DietsContext = createContext<DietsContextType | undefined>(undefined);

export const DietsProvider = ({ children }: { children: ReactNode }) => {
    const [diets, setDiets] = useState<DietType[]>([]);
    const pathname = usePathname();

    const refreshDiets = async () => {
        try {
            const { data } = await axios.get("/api/diets/getAll");
            setDiets(data.diets ?? []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        // ❗ если мы на главной — ничего не делаем
        if (pathname === "/") return;

        refreshDiets();
    }, [pathname]);

    return (
        <DietsContext.Provider value={{ diets, refreshDiets, setDiets }}>
            {children}
        </DietsContext.Provider>
    );
};

export const useDiets = () => {
    const context = useContext(DietsContext);
    if (!context) {
        throw new Error("useDiets must be used within a DietsProvider");
    }
    return context;
};
