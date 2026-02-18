import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

export function DietRestrictionsCard({
                                         initialRestrictions = [],
                                         onNext,
                                         onBack,
    draft
                                     }: {
    initialRestrictions?: string[];
    onNext: (data: { restrictions: string[] }) => void;
    onBack: () => void;
    draft:any
}) {
    const [value, setValue] = useState("");
    const [restrictions, setRestrictions] = useState<string[]>(draft.restrictions ??
        initialRestrictions
    );

    const addRestriction = () => {
        if (!value.trim()) return;
        if (restrictions.includes(value)) return;

        setRestrictions([...restrictions, value.trim()]);
        setValue("");
    };
    console.log(restrictions)
    const removeRestriction = (item: string) => {
        console.log('remove===')
        setRestrictions(restrictions.filter((r) => r !== item));
    };

    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">
                    🚫 Что вы не едите / не переносите
                </h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addRestriction();
                    }}
                >
                    <Input
                        placeholder="Например: молоко, арахис, глютен"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        enterKeyHint="done"
                    />
                </form>

                <div className="flex flex-wrap gap-2">
                    {restrictions.map((item) => (
                        <Badge
                            key={item}
                            variant="secondary"    onClick={() => {
                            console.log('asasgsgagasgas')
                            removeRestriction(item)
                        }}
                            className="flex cursor-pointer items-center gap-1"
                        >
                            {item}
                            <X
                                className="w-3 h-3 "

                            />
                        </Badge>
                    ))}
                </div>

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        Назад
                    </Button>
                    <Button disabled={value} onClick={() => onNext({ restrictions })}>
                        Продолжить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
