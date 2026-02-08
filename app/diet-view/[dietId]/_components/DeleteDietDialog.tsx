import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {useDiets} from "@/app/context/DietsContext";

export function DeleteDietAlert({ dietId }: { dietId: string }) {
    const router = useRouter();

    const {refreshDiets} = useDiets()

    const remove = async () => {
        try {
            await axios.delete(`/api/diets/delete?dietId=${dietId}`);
            toast.success("Диета удалена");
            refreshDiets()
            router.replace("/dashboard");
            router.refresh()
        } catch {
            toast.error("Ошибка удаления");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <TrashIcon />
                    Удалить
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить диету?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие необратимо. Все данные диеты будут удалены.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={remove}>
                        Удалить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
