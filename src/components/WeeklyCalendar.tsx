import { useState } from "react";
import { addDays, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMissionForDate } from "@/data/missions";
import MissionCard from "./MissionCard";
import MissionFlow from "./MissionFlow";

interface WeeklyCalendarProps {
  completedDates: string[];
}

const WeeklyCalendar = ({ completedDates }: WeeklyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMissionFlow, setShowMissionFlow] = useState(false);
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage?.startsWith("es") ? es : enUS;
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  const selectedMission = getMissionForDate(selectedDate);
  const isSelectedCompleted = completedDates.includes(format(selectedDate, "yyyy-MM-dd"));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const dateStr = format(day, "yyyy-MM-dd");
          const hasCompletedTask = completedDates.includes(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className="group relative flex flex-col items-center gap-2 p-2 transition-all"
            >
              <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {format(day, "EEEEE", { locale })}
              </span>

              <div
                className={`
                flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium transition-all duration-300
                ${
                  isSelected
                    ? "scale-110 bg-foreground text-background shadow-lg"
                    : isCurrentDay
                      ? "font-bold text-primary"
                      : "text-foreground group-hover:bg-white/5"
                }
              `}
              >
                {format(day, "d")}
              </div>

              <div
                className={`
                h-1.5 w-1.5 rounded-full transition-all duration-300
                ${hasCompletedTask ? "bg-green-500" : isSelected ? "bg-foreground" : "bg-transparent group-hover:bg-white/10"}
              `}
              />
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-muted-foreground/20">
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

      {showMissionFlow && (
        <MissionFlow onClose={() => setShowMissionFlow(false)} missionTitle={t(selectedMission.titleKey)} />
      )}
    </div>
  );
};

export default WeeklyCalendar;
