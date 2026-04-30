"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EventCountdownCard } from "@/components/ui/event-countdown-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderConfirmationCard } from "@/components/ui/order-confirmation-card";
import { SpotlightBorder } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

type CommunityEvent = {
  day: number;
  title: string;
  attendees: number;
  image: string;
};

type CommunityView = "calendar" | "form" | "success";

const highlightedEvents: CommunityEvent[] = [
  {
    day: 4,
    title: "Cómo usar IA sin abrumarte al empezar",
    attendees: 31,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  },
  {
    day: 9,
    title: "Automatizaciones simples para negocios reales",
    attendees: 24,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    day: 12,
    title: "Qué herramientas de IA sí valen la pena hoy",
    attendees: 47,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
  },
  {
    day: 18,
    title: "Prompts útiles para marketing y contenido",
    attendees: 28,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    day: 24,
    title: "IA aplicada a flujos de trabajo del día a día",
    attendees: 36,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
  },
];

const highlightedEventsByDay = new Map(
  highlightedEvents.map((event) => [event.day, event] as const),
);

const COMMUNITY_CALENDAR_WIDTH = 390;
const COMMUNITY_CARD_GAP = 18;
const COMMUNITY_EVENT_CARD_WIDTH = COMMUNITY_CALENDAR_WIDTH;
const COMMUNITY_PANEL_HEIGHT = 450;

const getNextEventDate = (day: number) => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), day, 18, 30);

  if (target <= now) {
    target.setMonth(target.getMonth() + 1);
  }

  return target;
};

const splitTitleByVisualWeight = (title: string) => {
  const words = title.split(/\s+/).filter(Boolean);

  if (words.length < 4) {
    return [title, ""] as const;
  }

  const splitIndex = Math.max(2, Math.ceil(words.length * 0.4));

  return [
    words.slice(0, splitIndex).join(" "),
    words.slice(splitIndex).join(" "),
  ] as const;
};

const CalendarDay: React.FC<{
  day: number | string;
  isHeader?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}> = ({
  day,
  isHeader,
  isActive = false,
  onClick,
}) => {
  const isHighlighted =
    !isHeader && typeof day === "number" && highlightedEventsByDay.has(day);
  const Comp = isHighlighted ? "button" : "div";

  return (
    <Comp
      type={Comp === "button" ? "button" : undefined}
      onClick={isHighlighted ? onClick : undefined}
      className={cn(
        "col-span-1 row-span-1 flex h-7 w-7 items-center justify-center",
        isHighlighted && "transition-transform hover:scale-105",
        isHeader ? "" : "rounded-xl",
        isHighlighted
          ? isActive
            ? "bg-[#CAFE5B] text-[#010101]"
            : "bg-[#CAFE5B] text-[#010101]"
          : "text-muted-foreground",
      )}
    >
      <span className={cn("font-medium", isHeader ? "text-[10px]" : "text-sm")}>
        {day}
      </span>
    </Comp>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <SpotlightBorder className={className} glowColor="polarist" radius={22}>
      <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-black/10 bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-colors duration-300 hover:bg-white">
        {children}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tl from-[#CAFE5B]/8 via-transparent to-transparent opacity-100 transition-opacity duration-300 ease-in-out" />
      </div>
    </SpotlightBorder>
  );
}

export function CommunityCalendar() {
  const [selectedEvent, setSelectedEvent] = React.useState<CommunityEvent | null>(
    null,
  );
  const [view, setView] = React.useState<CommunityView>("calendar");
  const [registrationName, setRegistrationName] = React.useState("");
  const [registrationEmail, setRegistrationEmail] = React.useState("");
  const canSubmitRegistration =
    registrationName.trim().length > 1 && registrationEmail.includes("@");
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const dateCells = Array.from({ length: daysInMonth }).map((_, index) => {
      const day = index + 1;
      const event = highlightedEventsByDay.get(day);

      return (
        <CalendarDay
          key={`date-${day}`}
          day={day}
          isActive={selectedEvent?.day === day}
          onClick={
            event
              ? () => {
                  setSelectedEvent((currentEvent) =>
                    currentEvent?.day === event.day ? null : event,
                  );
                  setView("calendar");
                }
              : undefined
          }
        />
      );
    });

  const renderCalendarDays = () => [
    ...dayNames.map((day) => (
      <CalendarDay key={`header-${day}`} day={day} isHeader />
    )),
    ...Array.from({ length: firstDayOfWeek }).map((_, index) => (
      <div
        key={`empty-start-${index}`}
        className="col-span-1 row-span-1 h-8 w-8"
      />
    )),
    ...dateCells,
  ];

  const handleStartRegistration = () => {
    if (!selectedEvent) {
      return;
    }

    setView("form");
  };

  const handleSubmitRegistration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmitRegistration) {
      return;
    }

    setView("success");
  };

  const handleBackToCalendar = () => {
    setRegistrationName("");
    setRegistrationEmail("");
    setView("calendar");
  };

  const selectedEventDate = selectedEvent
    ? getNextEventDate(selectedEvent.day)
    : null;
  const [selectedTitleFirstLine, selectedTitleSecondLine] = selectedEvent
    ? splitTitleByVisualWeight(selectedEvent.title)
    : ["", ""];

  return (
    <div
      className="relative mt-2 w-[390px] max-w-[calc(100vw-2rem)]"
      style={{ height: COMMUNITY_PANEL_HEIGHT }}
    >
      <AnimatePresence mode="wait">
        {view === "calendar" ? (
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="h-full w-full"
          >
            <div
              className="pointer-events-none absolute left-0 top-0 z-0 hidden md:block"
              style={{
                width: COMMUNITY_EVENT_CARD_WIDTH,
                height: COMMUNITY_PANEL_HEIGHT,
              }}
            >
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEvent.day}
                    initial={{
                      opacity: 0,
                      x: 0,
                      scale: 0.96,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: -(COMMUNITY_EVENT_CARD_WIDTH + COMMUNITY_CARD_GAP),
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      x: 0,
                      scale: 0.98,
                      filter: "blur(6px)",
                    }}
                    transition={{ duration: 0.34, ease: "easeOut" }}
                    className="pointer-events-auto h-full w-full"
                  >
                    <EventCountdownCard
                      title={selectedEvent.title}
                      image={selectedEvent.image}
                      attendees={selectedEvent.attendees}
                      date={selectedEventDate ?? undefined}
                      onJoin={handleStartRegistration}
                      className="h-full w-full"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <motion.div
              animate={{ x: 0 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="relative z-10 h-full w-full"
            >
              <BentoCard className="h-full min-w-0">
                <div className="mx-auto w-[340px] max-w-full">
                  <div>
                    <h2 className="mb-1.5 text-xl font-semibold tracking-[-0.03em] text-[#010101] md:text-2xl">
                      Próximos encuentros
                    </h2>
                    <p className="text-xs leading-5 text-[#5f6470] md:text-sm">
                      Descubre nuestras próximas llamadas para entender mejor el
                      mundo de la IA.
                    </p>
                  </div>

                  <div className="mx-auto mt-3 aspect-square w-[340px]">
                    <div
                      className="flex h-full flex-col rounded-2xl border border-black/[0.05] bg-white px-4 py-3.5"
                      style={{
                        boxShadow:
                          "0px 2px 1.5px 0px rgba(165,174,184,0.22) inset",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-[#010101]">
                          <span className="font-medium capitalize">
                            {currentMonth}, {currentYear}
                          </span>
                        </p>
                        <span className="h-1 w-1 rounded-full bg-[#c5cad5]" />
                        <p className="text-[11px] text-muted-foreground">
                          Charlas y encuentros
                        </p>
                      </div>
                      <div className="mt-3 grid flex-1 grid-cols-7 place-items-center gap-1.5">
                        {renderCalendarDays()}
                      </div>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          </motion.div>
        ) : null}

        {view === "form" && selectedEvent ? (
          <motion.form
            key="registration-form"
            initial={{ opacity: 0, scale: 0.95, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onSubmit={handleSubmitRegistration}
            className="flex h-full w-full flex-col rounded-2xl border border-black/10 bg-white p-6 text-[#010101] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-[#6b7280]">
                {selectedEventDate?.toLocaleDateString()}
              </p>
              <h2 className="mx-auto mt-2 max-w-[21rem] text-xl font-bold leading-tight">
                <span className="block">{selectedTitleFirstLine}</span>
                {selectedTitleSecondLine ? (
                  <span className="block">{selectedTitleSecondLine}</span>
                ) : null}
              </h2>
            </div>

            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="community-name">
                  Nombre
                </label>
                <Input
                  id="community-name"
                  value={registrationName}
                  onChange={(event) => setRegistrationName(event.target.value)}
                  placeholder="Tu nombre"
                  className="h-12 rounded-xl"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="community-email">
                  Mail
                </label>
                <Input
                  id="community-email"
                  type="email"
                  value={registrationEmail}
                  onChange={(event) => setRegistrationEmail(event.target.value)}
                  placeholder="tu@mail.com"
                  className="h-12 rounded-xl"
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!canSubmitRegistration}
              className="mt-auto h-12 rounded-xl bg-black text-base font-semibold text-white hover:bg-black/90 disabled:opacity-40"
            >
              Confirmar registro
            </Button>
          </motion.form>
        ) : null}

        {view === "success" && selectedEvent ? (
          <motion.div
            key="registration-success"
            initial={{ opacity: 0, scale: 0.95, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="h-full w-full"
          >
            <OrderConfirmationCard
              name={registrationName.trim()}
              email={registrationEmail.trim()}
              dateTime={(selectedEventDate ?? new Date()).toLocaleDateString()}
              onGoToAccount={handleBackToCalendar}
              className="h-full max-w-none"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
