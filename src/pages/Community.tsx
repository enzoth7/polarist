import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Play, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { CommunityCalendar } from "@/components/ui/community-calendar";
import { supabase } from "@/lib/supabase";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 22 },
  },
};

const CAROUSEL_EVENTS = [
  {
    title: "La forma más simple de usar IA en tu vida",
    description: "Charla sobre el avance y la actualidad de la IA con actividades prácticas y ejemplos para poder aplicarlo en negocios.",
    image: "/images/events/Pymes11.jpg",
    date: "Mayo 2026",
    location: "Centro PYMES",
    hueRotate: "hue-rotate-0",
  },
  {
    title: "La forma más simple de usar IA en tu vida",
    description: "Charla sobre el avance y la actualidad de la IA con actividades prácticas y ejemplos para poder aplicarlo en negocios.",
    image: "/images/events/Pymes22.jpg",
    date: "Mayo 2026",
    location: "Centro PYMES",
    hueRotate: "hue-rotate-0",
  },
  {
    title: "La forma más simple de usar IA en tu vida",
    description: "Charla sobre el avance y la actualidad de la IA con actividades prácticas y ejemplos para poder aplicarlo en negocios.",
    image: "/images/events/Pymes33.jpg",
    date: "Mayo 2026",
    location: "Centro PYMES",
    hueRotate: "hue-rotate-0",
  }
];

const Community = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  type Recording = {
    id: string;
    title: string;
    duration: string;
    link: string;
    event_date: string;
  };

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(true);

  useEffect(() => {
    async function getRecordings() {
      try {
        const { data, error } = await supabase
          .from("community_recordings")
          .select("id, title, duration, link, event_date")
          .order("event_date", { ascending: false });

        if (error) throw error;
        setRecordings(data ?? []);
      } catch (err) {
        console.error("Error fetching recordings:", err);
      } finally {
        setIsLoadingRecordings(false);
      }
    }

    void getRecordings();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTitle = (title: string) => {
    const words = title.trim().split(/\s+/);
    if (words.length <= 3) {
      return words.join("\u00a0");
    }
    const firstPart = words.slice(0, -3).join(" ");
    const lastPart = words.slice(-3).join("\u00a0");
    return `${firstPart} ${lastPart}`;
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_EVENTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_EVENTS.length) % CAROUSEL_EVENTS.length);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-4 md:px-8 pt-32 md:pt-40 pb-32"
      style={{ backgroundColor: "#010101" }}
    >
      {/* Background Grids & Ambient Effects */}
      <div className="absolute inset-0 z-0 bg-grid-white/[0.015] pointer-events-none" />
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{ backgroundColor: "rgba(202,254,91,0.02)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full blur-[160px]"
        style={{ backgroundColor: "rgba(202,254,91,0.02)" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-7xl flex flex-col items-center"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20 max-w-5xl w-full">
          <h1
            className="mb-5 md:whitespace-nowrap"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontSize: "clamp(36px, 8vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.05,
              color: "#F6F6F6",
            }}
          >
            Conectá, <strong className="text-[#CAFE5B] font-bold">aprendé</strong> e implementá
          </h1>
          <p
            className="mx-auto max-w-4xl text-[16px] md:text-[18px] font-light leading-relaxed"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              color: "rgba(246,246,246,0.6)",
            }}
          >
            Un punto de encuentro activo para líderes, creadores y profesionales de la tecnología. Descubrí próximos encuentros, explorá eventos en los que participamos y accedé a grabaciones y recursos compartidos.
          </p>
        </motion.div>

        {/* Main Grid: Carousel (Left) + Calendar (Right) */}
        <motion.div
          variants={itemVariants}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-28 max-w-7xl"
        >
          {/* Left Column: Carousel */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col w-full mt-2 relative z-10">
            {/* Header Text Block (Fixed height on desktop for perfect top card alignment) */}
            <div className="flex flex-col text-left h-auto lg:h-[120px] mb-6">
              <h2
                className="text-2xl md:text-3xl font-bold mb-3 text-[#F6F6F6]"
                style={{
                  fontFamily: "var(--font-sequel, sans-serif)",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                }}
              >
                Eventos & Experiencias
              </h2>
              <p
                className="text-xs md:text-sm text-zinc-500 max-w-md"
                style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
              >
                Reviví en imágenes las conferencias, workshops y encuentros presenciales donde compartimos optimizaciones de IA y dinámicas de grupo.
              </p>
            </div>

            {/* Carousel Frame */}
            <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-white/[0.06] bg-zinc-950 p-[1px] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[23px]">
                {/* Active Slide Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={CAROUSEL_EVENTS[activeIndex].image}
                      alt={CAROUSEL_EVENTS[activeIndex].title}
                      className={`h-full w-full object-cover select-none ${CAROUSEL_EVENTS[activeIndex].hueRotate}`}
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Event Content Overlay (restricted width) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
                  <div className="max-w-[72%] sm:max-w-[55%] md:max-w-[60%] flex flex-col pointer-events-auto">
                    <div className="mb-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[#F6F6F6] font-medium" style={{ fontFamily: "var(--font-sequel, sans-serif)" }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#CAFE5B] shrink-0" />
                        <p className="text-[#F6F6F6]">{CAROUSEL_EVENTS[activeIndex].date}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#F6F6F6]/80 shrink-0" />
                        <p className="text-[#F6F6F6] truncate max-w-[120px]">{CAROUSEL_EVENTS[activeIndex].location.split(",")[0]}</p>
                      </div>
                    </div>

                    <h3
                      className="mb-2 text-lg md:text-xl lg:text-2xl font-bold text-[#F6F6F6] leading-tight"
                      style={{ fontFamily: "var(--font-sequel, sans-serif)", letterSpacing: "-0.8px" }}
                    >
                      {CAROUSEL_EVENTS[activeIndex].title}
                    </h3>
                    
                    <p
                      className="text-[11px] md:text-xs lg:text-sm font-light leading-relaxed text-zinc-300"
                      style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
                    >
                      {CAROUSEL_EVENTS[activeIndex].description}
                    </p>
                  </div>
                </div>

                {/* Floating Navigation & Miniature Thumbnails (Floating directly on top of the image) */}
                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-4">
                  {/* Arrows (Visible on mobile/tablet, hidden on desktop/web sm+) */}
                  <div className="flex sm:hidden gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/65 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                      title="Anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/65 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                      title="Siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Miniature Thumbnails (Hidden on mobile, visible on desktop/web sm+) */}
                  <div className="hidden sm:flex items-center gap-3">
                    {CAROUSEL_EVENTS.map((event, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          className={`relative w-20 h-28 rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl ${
                            isActive 
                              ? "border-white scale-105 shadow-2xl opacity-100" 
                              : "border-white/10 opacity-50 hover:opacity-100 hover:scale-102"
                          } cursor-pointer`}
                          title={event.title}
                        >
                          <img
                            src={event.image}
                            alt={event.title}
                            className={`h-full w-full object-cover ${event.hueRotate}`}
                          />
                          <div className="absolute inset-0 bg-black/10" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Container */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start w-full mt-2 relative z-30">
            {/* Header Text Block (Fixed height on desktop for perfect top card alignment) */}
            <div className="flex flex-col text-left h-auto lg:h-[120px] mb-6 w-full">
              <h2
                className="text-2xl md:text-3xl font-bold mb-3 text-[#F6F6F6]"
                style={{
                  fontFamily: "var(--font-sequel, sans-serif)",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                }}
              >
                Meetings online
              </h2>
              <p
                className="text-xs md:text-sm text-zinc-500 max-w-sm"
                style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
              >
                Sumate a nuestras llamadas virtuales.
              </p>
            </div>

            <div className="relative p-[1px] rounded-[24px] bg-gradient-to-b from-white/[0.08] to-transparent shadow-2xl w-fit">
              <CommunityCalendar />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Zooms & Recordings (Dynamic database list) */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-6xl font-medium mb-4 text-[#F6F6F6]"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              Meetings anteriores
            </h2>
          </div>

          <div className="w-full max-w-5xl mx-auto divide-y divide-white/10 mt-6">
            {isLoadingRecordings ? (
              // Loading Skeleton State
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 px-2 h-20"
                />
              ))
            ) : recordings.length > 0 ? (
              recordings.map((recording, idx) => {
                const chronologicalNumber = recordings.length - idx;
                const formattedNum = String(chronologicalNumber).padStart(2, "0");
                
                return (
                  <a
                    key={recording.id}
                    href={recording.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-row items-center justify-between gap-4 py-5 px-4 -mx-4 rounded-2xl transition-all duration-300 border-b border-white/[0.04] hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] no-underline"
                  >
                    {/* Left/Middle Content: Number + Title + Date + Duration */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      
                      {/* Number (Chronological: oldest = 01) */}
                      <div 
                        className="text-sm font-bold text-zinc-500 min-w-[24px] group-hover:text-[#CAFE5B] transition-colors duration-300 pt-0.5 md:pt-0 shrink-0"
                        style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
                      >
                        {formattedNum}
                      </div>
                      
                      {/* Text Column wrapper: Title on top, Metadata below in mobile. Expanding into row in desktop. */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-1 min-w-0 gap-1.5 md:gap-6">
                        
                        {/* Title (Bold, in Sequel Sans with sliding animation) */}
                        <div className="min-w-0 transition-transform duration-300 group-hover:translate-x-1.5 flex-1">
                          <strong 
                            className="text-[14px] xs:text-[15px] font-bold tracking-tight text-[#F6F6F6] leading-snug group-hover:text-white transition-colors duration-300 block text-left"
                            style={{ 
                              fontFamily: "var(--font-sequel, sans-serif)",
                              textWrap: "balance"
                            }}
                          >
                            {formatTitle(recording.title)}
                          </strong>
                        </div>

                        {/* Metadata (Date & Duration) wrapper */}
                        <div 
                          className="flex items-center gap-2 md:gap-6 text-[12px] md:text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 shrink-0"
                          style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
                        >
                          <p>{formatDate(recording.event_date)}</p>
                          <p className="text-zinc-600">•</p>
                          <p className="text-zinc-500 font-medium group-hover:text-[#CAFE5B]/85 transition-colors duration-300">{recording.duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Action: Premium Adaptive Button */}
                    <div className="flex-shrink-0">
                      <div
                        className="inline-flex items-center justify-center rounded-full border border-white/10 text-[#F6F6F6] transition-all duration-300 group-hover:bg-[#CAFE5B] group-hover:text-[#010101] group-hover:border-[#CAFE5B] group-hover:scale-105 active:scale-95 cursor-pointer shadow-md h-9 w-9 md:h-auto md:w-auto md:px-5 md:py-2 md:gap-1.5 text-xs font-bold tracking-tight"
                        style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
                      >
                        <p className="hidden md:inline">Ver video</p>
                        <Play className="h-3.5 w-3.5 fill-current md:h-3 md:w-3 md:ml-0.5" />
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No hay grabaciones disponibles por el momento.
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Community;
