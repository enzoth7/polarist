import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { getMissionForDate } from "@/data/missions";
import MissionCard from "./MissionCard";
import MissionFlow from "./MissionFlow";
import { ChevronDown } from "lucide-react";

interface WeeklyCalendarProps {
  completedDates: string[];
}

const WeeklyCalendar = ({ completedDates }: WeeklyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMissionFlow, setShowMissionFlow] = useState(false);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const selectedMission = getMissionForDate(selectedDate);
  const isSelectedCompleted = completedDates.includes(format(selectedDate, "yyyy-MM-dd"));

  return (
    <div className="flex flex-col gap-6">
      {/* Scrollable container for mobile if needed, though 7 days usually fit */}
      <div className="flex justify-between items-center px-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const dateStr = format(day, "yyyy-MM-dd");
          const hasCompletedTask = completedDates.includes(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className="group flex flex-col items-center gap-2 relative p-2 transition-all"
            >
              <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-foreground" : "text-muted-foreground"
                }`}>
                {format(day, "EEEEE", { locale: es })}
              </span>

              <div className={`
                h-10 w-10 flex items-center justify-center rounded-full text-lg font-medium transition-all duration-300
                ${isSelected
                  ? "bg-foreground text-background scale-110 shadow-lg"
                  : isCurrentDay
                    ? "text-primary font-bold"
                    : "text-foreground group-hover:bg-white/5"}
              `}>
                {format(day, "d")}
              </div>

              {/* Dot indicator */}
              <div className={`
                h-1.5 w-1.5 rounded-full transition-all duration-300
                ${hasCompletedTask
                  ? "bg-green-500"
                  : isSelected
                    ? "bg-foreground"
                    : "bg-transparent group-hover:bg-white/10"}
              `} />
            </button>
          );
        })}
      </div>

      {/* Expandable Content Area */}
      <div className="animate-fade-in relative">
        {/* Connection Arrow */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-muted-foreground/20">
          <ChevronDown className="h-6 w-6" />
        </div>

        <div className="bg-card/50 rounded-3xl p-1 border border-white/5 backdrop-blur-sm">
          {isSelectedCompleted ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 animate-check-bounce">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">¡Misión Cumplida!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Has completado la tarea del {format(selectedDate, "dd 'de' MMMM", { locale: es })}.</p>
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

      {showMissionFlow && (
        <MissionFlow
          onClose={() => setShowMissionFlow(false)}
          missionTitle={selectedMission.title}
        />
      )}
    </div>
  );
};

export default WeeklyCalendar;
