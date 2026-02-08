"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

type Diet = {
    createdOn: string;
};

function getLastMonths(count = 9) {
    const months = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            label: d.toLocaleDateString("ru-RU", {
                month: "short",
                year: "numeric",
            }),
            month: d.getMonth(),
            year: d.getFullYear(),
        });
    }

    return months;
}

function buildChartData(diets: Diet[]) {
    const months = getLastMonths(9);

    return months.map(m => {
        const count = diets.filter(d => {
            const date = new Date(d.createdOn);
            return (
                date.getMonth() === m.month &&
                date.getFullYear() === m.year
            );
        }).length;

        return {
            month: m.label,
            diets: count,
        };
    });
}

export function ChartAreaDiets({ diets }: { diets: Diet[] }) {
    const data = buildChartData(diets);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Созданные диеты за 9 месяцев</CardTitle>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={{
                        diets: {
                            label: "Диеты",
                            color: "var(--primary)",
                        },
                    }}
                >
                    <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            dataKey="diets"
                            type="natural"
                            fill="var(--color-diets)"
                            fillOpacity={0.6}
                            stroke="var(--color-diets)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}