import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { getMissionForDate } from "@/data/missions";
import MissionCard from "./MissionCard";
import MissionFlow from "./MissionFlow";
import { ChevronLeft, ChevronDown, Check } from "lucide-react";

interface MonthlyCalendarProps {
    completedDates: string[];
}

const MonthlyCalendar = ({ completedDates }: MonthlyCalendarProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showMissionFlow, setShowMissionFlow] = useState(false);

    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Get days including padding for the grid to start on Monday
    const viewStart = startOfWeek(currentMonthStart, { weekStartsOn: 1 });
    const viewEnd = endOfWeek(currentMonthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: viewStart, end: viewEnd });

    const selectedMission = selectedDate ? getMissionForDate(selectedDate) : null;
    const isSelectedCompleted = selectedDate ? completedDates.includes(format(selectedDate, "yyyy-MM-dd")) : false;

    return (
        <div className="flex flex-col gap-6 transition-all duration-500">

            {/* Header (Month Name) - Only visible when NOT selected to keep focus clean */}
            {!selectedDate && (
                <div className="flex items-center justify-between px-2 mb-2 animate-fade-in">
                    <h2 className="text-xl font-bold capitalize text-foreground">
                        {format(today, "MMMM yyyy", { locale: es })}
                    </h2>
                </div>
            )}

            {/* Calendar Grid Container */}
            <div className={`transition-all duration-500 relative ${selectedDate ? "h-auto" : "min-h-[300px]"}`}>

                {/* Back Button (Only when selected) */}
                {selectedDate && (
                    <button
                        onClick={() => setSelectedDate(null)}
                        className="absolute -top-12 left-0 p-2 rounded-full bg-card border border-white/5 text-muted-foreground hover:text-foreground animate-fade-in flex items-center gap-2"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Volver al mes</span>
                    </button>
                )}

                {/* The Grid / Focus View */}
                <div className={`
          ${selectedDate ? "flex justify-center" : "grid grid-cols-7 gap-y-4 gap-x-2"}
        `}>

                    {/* Weekday Headers (Only in grid view) */}
                    {!selectedDate && ["L", "M", "M", "J", "V", "S", "D"].map((dayName) => (
                        <div key={dayName} className="text-center text-xs font-medium text-muted-foreground/50 py-2">
                            {dayName}
                        </div>
                    ))}

                    {days.map((day) => {
                        const dateStr = format(day, "yyyy-MM-dd");
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentMonth = day.getMonth() === today.getMonth();

                        // Logic: If selection exists, HIDE all other days.
                        if (selectedDate && !isSelected) return null;

                        const isCurrentDay = isToday(day);
                        const hasCompletedTask = completedDates.includes(dateStr);

                        // Hide padding days from other months in grid view if preferred, 
                        // or just dim them. For minimalistic "Apple" style, usually we show them dimmed.
                        if (!selectedDate && !isCurrentMonth) {
                            return <div key={dateStr} />; // Empty space or very dim
                        }

                        return (
                            <button
                                key={dateStr}
                                onClick={() => setSelectedDate(day)}
                                className={`
                   group flex flex-col items-center gap-2 relative transition-all duration-500
                   ${selectedDate ? "scale-125 p-4" : "hover:scale-105 p-1"}
                `}
                            >
                                {/* Day Number Circle */}
                                <div className={`
                  flex items-center justify-center rounded-full font-medium transition-all duration-300
                  ${selectedDate
                                        ? "h-16 w-16 text-2xl bg-foreground text-background shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        : "h-9 w-9 text-sm"
                                    }
                  ${!selectedDate && isCurrentDay ? "bg-primary text-primary-foreground font-bold shadow-lg" : ""}
                  ${!selectedDate && !isCurrentDay && hasCompletedTask ? "text-green-400" : ""}
                  ${!selectedDate && !isCurrentDay && !hasCompletedTask ? "text-foreground group-hover:bg-white/5" : ""}
                `}>
                                    {format(day, "d")}
                                </div>

                                {/* Dot indicator (Only in grid view or if relevant) */}
                                {!selectedDate && hasCompletedTask && (
                                    <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                                )}
                                {!selectedDate && !hasCompletedTask && isCurrentDay && (
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* EXPANDABLE MISSION CARD (Only when selected) */}
            {selectedMission && (
                <div className="animate-fade-in relative mt-4">
                    {/* Connection Arrow */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-muted-foreground/20 animate-bounce">
                        <ChevronDown className="h-6 w-6" />
                    </div>

                    <div className="bg-card/50 rounded-3xl p-1 border border-white/5 backdrop-blur-sm">
                        {isSelectedCompleted ? (
                            <div className="py-12 text-center animate-fade-in">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 animate-check-bounce">
                                    <span className="text-4xl">🎉</span>
                                </div>
                                <h2 className="text-xl font-bold text-foreground">¡Misión Cumplida!</h2>
                                <p className="mt-2 text-sm text-muted-foreground">Has completado la tarea del {format(selectedDate!, "dd 'de' MMMM", { locale: es })}.</p>

                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
                                >
                                    Ver calendario
                                </button>
                            </div>
                        ) : (
                            <MissionCard
                                title={selectedMission.title}
                                description={selectedMission.description}
                                category={selectedMission.category}
                                onStart={() => setShowMissionFlow(true)}
                            />
                        )}
                    </div>
                </div>
            )}

            {showMissionFlow && selectedMission && (
                <MissionFlow
                    onClose={() => setShowMissionFlow(false)}
                    missionTitle={selectedMission.title}
                />
            )}
        </div>
    );
};

export default MonthlyCalendar;
