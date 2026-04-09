import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const DATE_PRESETS = [
    { label: "Hoje", getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
    { label: "Ontem", getValue: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
    { label: "Últimos 7 dias", getValue: () => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }) },
    { label: "Últimos 30 dias", getValue: () => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }) },
    { label: "Este mês", getValue: () => ({ from: startOfMonth(new Date()), to: endOfDay(new Date()) }) },
    { label: "Mês passado", getValue: () => { const prev = subMonths(new Date(), 1); return { from: startOfMonth(prev), to: endOfMonth(prev) }; } },
];

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
    className,
    date,
    setDate,
}: DatePickerWithRangeProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal bg-secondary border-border h-9 text-sm",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd LLL, y", { locale: ptBR })} -{" "}
                                    {format(date.to, "dd LLL, y", { locale: ptBR })}
                                </>
                            ) : (
                                format(date.from, "dd LLL, y", { locale: ptBR })
                            )
                        ) : (
                            <span>Filtrar por data</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border bg-card" align="start">
                    <div className="flex">
                        <div className="flex flex-col gap-1 border-r border-border p-3 min-w-[140px]">
                            {DATE_PRESETS.map((preset) => (
                                <Button
                                    key={preset.label}
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-xs h-8 font-normal hover:bg-accent"
                                    onClick={() => setDate(preset.getValue())}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                            {date && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-xs h-8 font-normal text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                                    onClick={() => setDate(undefined)}
                                >
                                    Limpar
                                </Button>
                            )}
                        </div>
                        <Calendar
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={ptBR}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
