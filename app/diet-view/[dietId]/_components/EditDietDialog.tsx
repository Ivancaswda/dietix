import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { EditIcon } from "lucide-react";

export function EditDietDialog({
                                   diet,
                                   onUpdated,
                               }: {
    diet: {
        dietId: string;
        name: string;
        notes?: string;
    };
    onUpdated: (data: { name: string; notes: string }) => void;
}) {
    console.log('diet===', diet)
    const [name, setName] = useState(diet.name);
    const [description, setDescription] = useState(diet.notes ?? "");
    const [loading, setLoading] = useState(false);

    const save = async () => {
        try {
            setLoading(true);
            await axios.put("/api/diets/update", {
                dietId: diet.dietId,
                name,
                description,
            });
            toast.success("Данные обновлены");
            onUpdated({ name, notes: description });
        } catch {
            toast.error("Ошибка обновления");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <EditIcon />
                    Изменить
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование диеты</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className='my-2'>Название</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label className='my-2'>Описание</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={save} disabled={loading}>
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
