import { useMemo, useState } from "react";
import { format, subDays, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, getDay } from "date-fns";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContributionGraphProps {
    data: {
        lettersLearned: { letter: string; date: string }[];
        quizScores: { score: number; total: number; date: string }[];
        practiceSessions?: number; // Backend doesn't give dates for these yet
    };
}

const ContributionGraph = ({ data }: ContributionGraphProps) => {
    // Generate last 365 days
    const today = new Date();
    const startDate = subDays(today, 364); // Show last year

    // Aggregate data by date
    const activityMap = useMemo(() => {
        const map = new Map<string, number>();

        // Count letters learned
        data.lettersLearned.forEach(item => {
            const dateKey = format(new Date(item.date), 'yyyy-MM-dd');
            map.set(dateKey, (map.get(dateKey) || 0) + 1);
        });

        // Count quizzes (maybe weight them higher? for now just count as 1 activity)
        data.quizScores.forEach(item => {
            const dateKey = format(new Date(item.date), 'yyyy-MM-dd');
            map.set(dateKey, (map.get(dateKey) || 0) + 1);
        });

        return map;
    }, [data]);

    // Generate grid weeks
    // We need to align start date to Sunday/Monday to make the grid look like a calendar
    // Use startOfWeek to get the preceeding Sunday
    const calendarStart = startOfWeek(startDate);
    const days = eachDayOfInterval({ start: calendarStart, end: today });

    // Group by weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
        currentWeek.push(day);
        if (getDay(day) === 6) { // Saturday
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    // Color scale function
    const getColor = (count: number) => {
        if (count === 0) return "bg-muted/40";
        if (count === 1) return "bg-green-200 dark:bg-green-900/40";
        if (count <= 3) return "bg-green-300 dark:bg-green-800/60";
        if (count <= 5) return "bg-green-400 dark:bg-green-600";
        return "bg-green-600 dark:bg-green-500"; // High activity
    };

    const getIntensityLabel = (count: number) => {
        if (count === 0) return "No activity";
        if (count === 1) return "1 activity";
        return `${count} activities`;
    };

    return (
        <Card className="p-6 bg-gradient-card shadow-card border-border/50 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-green-500 animate-pulse" />
                Activity Map
            </h2>

            <div className="min-w-[800px]"> {/* Ensure scroll on small screens */}
                <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const count = activityMap.get(dateKey) || 0;

                                // Hide days before the actual start date if needed, or just show them empty
                                // GitHub shows exactly 52/53 cols.

                                return (
                                    <TooltipProvider key={dateKey}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: weekIndex * 0.01 + dayIndex * 0.005 }}
                                                    className={`w-3 h-3 rounded-[2px] ${getColor(count)} hover:ring-1 hover:ring-ring transition-colors cursor-pointer`}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="text-xs">
                                                    <p className="font-semibold">{format(day, 'MMM d, yyyy')}</p>
                                                    <p>{getIntensityLabel(count)}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-[2px] bg-muted/40" />
                    <div className="w-3 h-3 rounded-[2px] bg-green-200 dark:bg-green-900/40" />
                    <div className="w-3 h-3 rounded-[2px] bg-green-400 dark:bg-green-600" />
                    <div className="w-3 h-3 rounded-[2px] bg-green-600 dark:bg-green-500" />
                    <span>More</span>
                </div>
            </div>
        </Card>
    );
};

export default ContributionGraph;
