import { CinematicSlider } from "@/components/radar/CinematicSlider";
import { RadarMetricsBoard } from "@/components/radar/RadarMetricsBoard";

const trendItems = [
  {
    title: "La mayor actualización de ChatGPT",
    description:
      "La nueva versión ahora puede leer montañas de información de una sola vez (como libros enteros o decenas de balances) y planificar tareas sola sin que estés encima.",
    accent: "from-amber-300 via-orange-400 to-rose-500",
    glow: "bg-orange-300/35",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Google hace su IA más barata y veloz",
    description:
      "Presentaron a Gemini 3.1 Flash-Lite, una inteligencia muchísimo más rápida pensada para emprendedores que necesitan hacer 10.000 tareas automáticas de golpe sin arruinarse pagando.",
    accent: "from-cyan-300 via-sky-500 to-indigo-600",
    glow: "bg-sky-300/30",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "La próxima generación de cerebros para la IA",
    description:
      "NVIDIA, la empresa que fabrica las 'placas madre' de las inteligencias artificiales, anunció Rubin. Serán el corazón de la IA para que razonen mucho más como humanos.",
    accent: "from-fuchsia-300 via-pink-500 to-violet-600",
    glow: "bg-fuchsia-300/30",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "La IA ya empieza a usar el mouse por vos",
    description:
      "Los creadores de Claude probaron un modelo de IA que literalmente toma control de tu computadora (Mac) para organizar tus archivos y cliquear programas autónomamente.",
    accent: "from-emerald-300 via-teal-500 to-cyan-600",
    glow: "bg-emerald-300/30",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Los bots que trabajan solos ya son reales",
    description:
      "Muchas startups están lanzando software que no te pide chatear, sino que vos le decis 'Buscá los mejores clientes en internet y preparales un email a cada uno', y lo hace.",
    accent: "from-yellow-300 via-lime-400 to-emerald-500",
    glow: "bg-lime-300/30",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
  },
] as const;

const Radar = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-2 md:px-8 md:pb-12 md:pt-3">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="space-y-4">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <div className="mx-auto w-full max-w-[1700px] px-4 md:px-8">
              <CinematicSlider items={trendItems} />
            </div>
          </div>
        </section>

        <RadarMetricsBoard />
      </div>
    </div>
  );
};

export default Radar;
