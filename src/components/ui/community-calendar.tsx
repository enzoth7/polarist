"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { EventCountdownCard } from "@/components/ui/event-countdown-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderConfirmationCard } from "@/components/ui/order-confirmation-card";
import { SpotlightBorder } from "@/components/ui/spotlight-card";
import { useAuth } from "@/hooks/useAuth";
import { usePageFocusOverlay } from "@/hooks/usePageFocusOverlay";
import { toModernImageAsset } from "@/lib/assetPaths";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const CALENDAR_WIDTH = 390;
const CARD_GAP = 18;
const PANEL_HEIGHT = 468;

type SupabaseEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
  is_active: boolean;
};

type CommunityView = "calendar" | "form" | "success";

type RegistrationPayload = {
  email: string;
  name: string;
};

const COMMUNITY_EVENT_OVERRIDES: Record<
  string,
  Partial<Pick<SupabaseEvent, "event_date" | "is_active">>
> = {
  "6a7cc3d8-ba8c-4c16-960e-f8717baaa96d": { is_active: false },
  "6171f1b7-5e89-4d24-8212-76d3119fcc55": { event_date: "2026-05-18T22:00:00+00:00" },
  "7c6b6420-122a-4647-aa0c-24cd9504c00f": { event_date: "2026-05-25T22:00:00+00:00" },
};

async function fetchCommunityEvents(): Promise<SupabaseEvent[]> {
  const { data, error } = await supabase
    .from("community_events")
    .select("id, title, description, event_date, image_url, is_active")
    .eq("is_active", true)
    .order("event_date", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as SupabaseEvent[])
    .map((event) => ({
      ...event,
      ...(COMMUNITY_EVENT_OVERRIDES[event.id] ?? {}),
    }))
    .filter((event) => event.is_active);
}

const splitTitle = (title: string) => {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length < 4) return [title, ""] as const;
  const idx = Math.max(2, Math.ceil(words.length * 0.4));
  return [words.slice(0, idx).join(" "), words.slice(idx).join(" ")] as const;
};

// ── CalendarDay ──────────────────────────────────────────────────────────────

const CalendarDay: React.FC<{
  day: number | string;
  isHeader?: boolean;
  hasFutureEvent?: boolean;
  hasPastEvent?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ day, isHeader, hasFutureEvent, hasPastEvent, isActive, onClick }) => {
  const Comp = hasFutureEvent ? "button" : "div";

  return (
    <Comp
      type={Comp === "button" ? "button" : undefined}
      onClick={hasFutureEvent ? onClick : undefined}
      className={cn(
        "col-span-1 row-span-1 flex h-7 w-7 items-center justify-center",
        !isHeader && "rounded-xl",
        hasFutureEvent && "cursor-pointer transition-transform hover:scale-105",
        hasFutureEvent
          ? isActive
            ? "bg-[#CAFE5B] text-[#010101]"
            : "bg-[#CAFE5B] text-[#010101]"
          : hasPastEvent
            ? "bg-black/[0.06] text-black/25"
            : "text-muted-foreground",
      )}
    >
      <span className={cn("font-medium", isHeader ? "text-[10px]" : "text-sm")}>
        {day}
      </span>
    </Comp>
  );
};

// ── BentoCard ────────────────────────────────────────────────────────────────

function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <SpotlightBorder className={className} glowColor="polarist" radius={22}>
      <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-black/10 bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-colors duration-300 hover:bg-white">
        {children}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tl from-[#CAFE5B]/8 via-transparent to-transparent opacity-100 transition-opacity duration-300 ease-in-out" />
      </div>
    </SpotlightBorder>
  );
}

// ── CommunityCalendar ────────────────────────────────────────────────────────

export function CommunityCalendar() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { setPageFocusOverlayOpen } = usePageFocusOverlay();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["community_events"],
    queryFn: fetchCommunityEvents,
    staleTime: 5 * 60_000,
  });

  const today = useMemo(() => new Date(), []);
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<SupabaseEvent | null>(null);
  const [view, setView] = useState<CommunityView>("calendar");
  const [registrationName, setRegistrationName] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-salto al primer mes con eventos futuros
  useEffect(() => {
    if (!events.length) return;

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const futureEvents = events.filter((e) => new Date(e.event_date) >= startOfToday);
    if (!futureEvents.length) return;

    const currentMonthHasFuture = futureEvents.some((e) => {
      const d = new Date(e.event_date);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    if (!currentMonthHasFuture) {
      const first = new Date(futureEvents[0].event_date);
      setDisplayMonth(first.getMonth());
      setDisplayYear(first.getFullYear());
    }
  }, [events, today]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, SupabaseEvent>();
    events.forEach((e) => {
      const d = new Date(e.event_date);
      if (d.getMonth() === displayMonth && d.getFullYear() === displayYear) {
        map.set(d.getDate(), e);
      }
    });
    return map;
  }, [events, displayMonth, displayYear]);

  const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  const renderCalendarDays = () => {
    const days = [];
    
    DAY_NAMES.forEach((d) => {
      days.push(<CalendarDay key={`h-${d}`} day={d} isHeader />);
    });

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="col-span-1 row-span-1 h-7 w-7" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const event = eventsByDay.get(day);
      const isPastEvent = event ? new Date(event.event_date) < new Date() : false;
      const isFutureEvent = event && !isPastEvent;

      days.push(
        <CalendarDay
          key={`day-${day}`}
          day={day}
          hasFutureEvent={isFutureEvent}
          hasPastEvent={isPastEvent}
          isActive={selectedEvent?.id === event?.id}
          onClick={() => {
            if (event && isFutureEvent) {
              setSelectedEvent(selectedEvent?.id === event.id ? null : event);
            }
          }}
        />
      );
    }

    return days;
  };

  const handleStartRegistration = () => {
    if (!selectedEvent || isSubmitting) return;

    const profileName = profile?.fullName?.trim();
    const profileEmail = profile?.email?.trim();

    setRegistrationName(profileName ?? "");
    setRegistrationEmail(profileEmail ?? "");
    setView("form");
  };

  const submitRegistration = async ({ name, email }: RegistrationPayload) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName || !normalizedEmail || isSubmitting || !selectedEvent) {
      return;
    }

    setIsSubmitting(true);
    setRegistrationName(normalizedName);
    setRegistrationEmail(normalizedEmail);

    try {
      const response = await fetch("https://epoolgyzovefaofyvocz.supabase.co/functions/v1/register-community-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          event_id: selectedEvent.id,
          event_date: selectedEvent.event_date,
          user_id: user?.id,
        }),
      });

      if (response.status === 409) {
        toast.error("Ya estás registrado para este encuentro.");
        return;
      }

      if (!response.ok) {
        let errorMessage = "Error en el registro";

        try {
          const errorPayload = await response.json();
          if (typeof errorPayload?.error === "string" && errorPayload.error.trim()) {
            errorMessage = errorPayload.error.trim();
          }
        } catch {
          // Keep the default message when the error payload is not JSON.
        }

        throw new Error(errorMessage);
      }

      setView("success");
      await queryClient.invalidateQueries({ queryKey: ["user-events"] });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Hubo un error al procesar tu registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRegistration({
      name: registrationName,
      email: registrationEmail,
    });
  };

  const handleGoToLibrary = () => {
    setPageFocusOverlayOpen(false);
    setView("calendar");
    setSelectedEvent(null);
    navigate(
      profile?.username?.trim()
        ? getAppUserProfileRoute(profile.username.trim())
        : routes.appProfile,
    );
  };

  const [titleFirstLine, titleSecondLine] = selectedEvent
    ? splitTitle(selectedEvent.title)
    : ["", ""];

  const eventTime = selectedEvent
    ? new Date(selectedEvent.event_date).toLocaleTimeString("es", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase()
    : "";

  return (
    <div className="relative mt-2 w-[390px] max-w-[calc(100vw-2rem)] md:h-[468px]">
      <AnimatePresence mode="wait">
        {view === "calendar" ? (
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            className="h-full w-full"
          >
            <div className="pointer-events-none absolute left-0 top-0 z-0 hidden md:block" style={{ width: 340, height: PANEL_HEIGHT }}>
              <AnimatePresence mode="wait">
                {selectedEvent && (
                  <motion.div
                    key={selectedEvent.id}
                    initial={{ opacity: 0, x: 0, scale: 0.96, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: -(340 + CARD_GAP), scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 0, scale: 0.98, filter: "blur(6px)" }}
                    transition={{ duration: 0.34, ease: "easeOut" }}
                    className="pointer-events-auto h-full w-full"
                  >
                    <EventCountdownCard
                      title={selectedEvent.title}
                      image={toModernImageAsset(selectedEvent.image_url) || "/Polarist_logo.webp"}
                      time={eventTime}
                      date={new Date(selectedEvent.event_date)}
                      isJoining={isSubmitting}
                      onJoin={handleStartRegistration}
                      className="h-full w-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div className="relative z-10 w-full h-[468px]">
              {/* Calendario principal (siempre visible en desktop, oculto en móvil si hay un evento) */}
              <div className={cn("h-full", selectedEvent ? "hidden md:block" : "block")}>
                <BentoCard className="h-full">
                  <div className="mx-auto flex h-full w-[340px] max-w-full flex-col">
                    <h2 className="mb-1 text-xl font-semibold tracking-tight text-[#010101] md:text-2xl">
                      Próximos encuentros
                    </h2>
                    <p className="text-xs leading-4.5 text-muted-foreground md:text-sm">
                      Descubre nuestras próximas llamadas para entender mejor el mundo de la IA.
                    </p>

                    <div className="mx-auto mt-2 flex-1 min-h-0 w-[340px]">
                      <div className="flex h-full flex-col rounded-2xl border border-black/[0.05] bg-white px-4 py-3.5 shadow-inner">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-medium capitalize text-[#010101]">
                            {MONTH_NAMES[displayMonth]}, {displayYear}
                          </p>
                          <span className="h-1 w-1 rounded-full bg-[#c5cad5]" />
                          <p className="text-[11px] text-muted-foreground">Charlas y encuentros</p>
                        </div>
                        <div className="mt-3 grid flex-1 grid-cols-7 place-items-center gap-1.5">
                          {isLoading ? (
                            <div className="col-span-7 py-20 text-xs text-muted-foreground">Cargando encuentros...</div>
                          ) : renderCalendarDays()}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-muted-foreground md:text-xs">
                      Presiona la fecha en verde para poder registrarte.
                    </p>
                  </div>
                </BentoCard>
              </div>

              {/* Vista móvil de detalles (reemplaza al calendario en el mismo espacio) */}
              {selectedEvent && (
                <div className="flex h-[468px] w-full flex-col md:hidden">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="mb-3 flex w-fit items-center text-sm font-medium text-[#F6F6F6] transition-colors hover:text-white"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Volver al calendario
                  </button>
                  <div className="flex-1 min-h-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`mobile-details-${selectedEvent.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        <EventCountdownCard
                          title={selectedEvent.title}
                          image={toModernImageAsset(selectedEvent.image_url) || "/Polarist_logo.webp"}
                          time={eventTime}
                          date={new Date(selectedEvent.event_date)}
                          isJoining={isSubmitting}
                          onJoin={handleStartRegistration}
                          className="h-full w-full"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : view === "form" ? (
          <motion.div
            key="registration-form"
            initial={{ opacity: 0, scale: 0.95, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)" }}
            className="flex h-full w-full flex-col"
          >
            <button 
              type="button"
              onClick={() => setView("calendar")}
              className="mb-3 flex w-fit items-center text-sm font-medium text-[#F6F6F6] transition-colors hover:text-white md:hidden"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Volver
            </button>
            <form
              onSubmit={handleSubmitRegistration}
              className="flex flex-1 w-full min-h-[468px] flex-col rounded-2xl border border-black/10 bg-white p-6 text-[#010101] shadow-2xl"
            >

            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {new Date(selectedEvent!.event_date).toLocaleDateString()}
              </p>
              <h2 className="mx-auto mt-2 max-w-[21rem] text-xl font-bold leading-tight">
                <span className="block">{titleFirstLine}</span>
                {titleSecondLine && <span className="block">{titleSecondLine}</span>}
              </h2>
            </div>

            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="name">Nombre</label>
                <Input
                  id="name"
                  value={registrationName}
                  onChange={(e) => setRegistrationName(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="email">Mail</label>
                <Input
                  id="email"
                  type="email"
                  value={registrationEmail}
                  onChange={(e) => setRegistrationEmail(e.target.value)}
                  placeholder="tu@mail.com"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !registrationName || !registrationEmail}
              className="mt-12 md:mt-auto h-12 rounded-xl bg-black text-white hover:bg-black/90 disabled:opacity-40"
            >
              {isSubmitting ? "Registrando..." : "Confirmar registro"}
            </Button>
          </form>
        </motion.div>
        ) : (
          <motion.div
            key="registration-success"
            initial={{ opacity: 0, scale: 0.95, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            className="h-full w-full"
          >
            <OrderConfirmationCard
              name={registrationName}
              email={registrationEmail}
              dateTime={new Date(selectedEvent!.event_date).toLocaleString("es-UY", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).toUpperCase()}
              onGoToAccount={handleGoToLibrary}
              buttonText="Ir a biblioteca"
              className="flex-1 w-full min-h-[468px] max-w-full shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
