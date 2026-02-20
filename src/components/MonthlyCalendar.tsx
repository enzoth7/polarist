import { useState } from "react";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isToday, startOfMonth, startOfWeek } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMissionForDate } from "@/data/missions";
import MissionCard from "./MissionCard";
import MissionFlow from "./MissionFlow";

interface MonthlyCalendarProps {
  completedDates: string[];
}

const MonthlyCalendar = ({ completedDates }: MonthlyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMissionFlow, setShowMissionFlow] = useState(false);
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage?.startsWith("es") ? es : enUS;
  const today = new Date();
  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);

  const viewStart = startOfWeek(currentMonthStart, { weekStartsOn: 1 });
  const viewEnd = endOfWeek(currentMonthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: viewStart, end: viewEnd });
  const selectedMission = selectedDate ? getMissionForDate(selectedDate) : null;
  const isSelectedCompleted = selectedDate ? completedDates.includes(format(selectedDate, "yyyy-MM-dd")) : false;

  return (
    <div className="flex flex-col gap-6 transition-all duration-500">
      {!selectedDate && (
        <div className="animate-fade-in mb-2 flex items-center justify-between px-2">
          <h2 className="text-xl font-bold capitalize text-foreground">{format(today, "MMMM yyyy", { locale })}</h2>
        </div>
      )}

      <div className={`relative transition-all duration-500 ${selectedDate ? "h-auto" : "min-h-[300px]"}`}>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="animate-fade-in absolute -top-12 left-0 flex items-center gap-2 rounded-full border border-white/5 bg-card p-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">{t("calendar.backToMonth")}</span>
          </button>
        )}

        <div className={`${selectedDate ? "flex justify-center" : "grid grid-cols-7 gap-x-2 gap-y-4"}`}>
          {!selectedDate &&
            t("calendar.weekDays", { returnObjects: true }).map((dayName: string) => (
              <div key={dayName} className="py-2 text-center text-xs font-medium text-muted-foreground/50">
                {dayName}
              </div>
            ))}

          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = day.getMonth() === today.getMonth();

            if (selectedDate && !isSelected) return null;

            const isCurrentDay = isToday(day);
            const hasCompletedTask = completedDates.includes(dateStr);

            if (!selectedDate && !isCurrentMonth) {
              return <div key={dateStr} />;
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                className={`group relative flex flex-col items-center gap-2 transition-all duration-500 ${
                  selectedDate ? "scale-125 p-4" : "p-1 hover:scale-105"
                }`}
              >
                <div
                  className={`
                  flex items-center justify-center rounded-full font-medium transition-all duration-300
                  ${selectedDate ? "h-16 w-16 bg-foreground text-2xl text-background shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "h-9 w-9 text-sm"}
                  ${!selectedDate && isCurrentDay ? "bg-primary font-bold text-primary-foreground shadow-lg" : ""}
                  ${!selectedDate && !isCurrentDay && hasCompletedTask ? "text-green-400" : ""}
                  ${!selectedDate && !isCurrentDay && !hasCompletedTask ? "text-foreground group-hover:bg-white/5" : ""}
                `}
                >
                  {format(day, "d")}
                </div>

                {!selectedDate && hasCompletedTask && <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />}
                {!selectedDate && !hasCompletedTask && isCurrentDay && <div className="h-1 w-1 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedMission && (
        <div className="relative mt-4 animate-fade-in">
          <div className="animate-bounce absolute -top-6 left-1/2 -translate-x-1/2 text-muted-foreground/20">
            <ChevronDown className="h-6 w-6" />
          </div>

          <div className="rounded-3xl border border-white/5 bg-card/50 p-1 backdrop-blur-sm">
            {isSelectedCompleted ? (
              <div className="animate-fade-in py-12 text-center">
                <div className="animate-check-bounce mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{t("calendar.missionCompletedTitle")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("calendar.missionCompletedDescription", {
                    date: format(selectedDate, "dd MMMM", { locale }),
                  })}
                </p>

                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-6 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {t("calendar.viewCalendar")}
                </button>
              </div>
            ) : (
              <MissionCard
                title={t(selectedMission.titleKey)}
                description={t(selectedMission.descriptionKey)}
                category={selectedMission.category}
                onStart={() => setShowMissionFlow(true)}
              />
            )}
          </div>
        </div>
      )}

      {showMissionFlow && selectedMission && (
        <MissionFlow onClose={() => setShowMissionFlow(false)} missionTitle={t(selectedMission.titleKey)} />
      )}
    </div>
  );
};

export default MonthlyCalendar;
