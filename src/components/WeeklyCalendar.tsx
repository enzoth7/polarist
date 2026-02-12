import { format, startOfWeek, addDays, isToday, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Check } from "lucide-react";

interface WeeklyCalendarProps {
  completedDates: string[];
}

const WeeklyCalendar = ({ completedDates }: WeeklyCalendarProps) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex gap-2">
      {days.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const isCompleted = completedDates.includes(dateStr);
        const isTodayDate = isToday(day);
        const isPast = isBefore(startOfDay(day), startOfDay(today)) && !isTodayDate;

        return (
          <div
            key={dateStr}
            className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3 transition-all ${
              isTodayDate
                ? "bg-primary/10 ring-2 ring-primary/20"
                : "bg-card"
            }`}
          >
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {format(day, "EEE", { locale: es }).slice(0, 2)}
            </span>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold ${
                isCompleted
                  ? "bg-success text-success-foreground"
                  : isTodayDate
                  ? "bg-primary text-primary-foreground"
                  : isPast
                  ? "bg-muted text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                format(day, "d")
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
