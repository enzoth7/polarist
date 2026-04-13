import { CinematicSlider } from "@/components/radar/CinematicSlider";
import { FinalCTA } from "@/components/layout/FinalCTA";
import { routes } from "@/lib/routes";

const trendItems = [
  {
    title: "La mayor actualización de ChatGPT",
    description:
      "La nueva versión ahora puede leer montañas de información de una sola vez (como libros enteros o decenas de balances) y planificar tareas sola sin que estés encima.",
    accent: "from-amber-300 via-orange-400 to-rose-500",
    glow: "bg-orange-300/35",
    image: "/images/tendencias/0567845538eb96368b4c86e2a7f4e9b2.jpg",
  },
  {
    title: "Google hace su IA más barata y veloz",
    description:
      "Presentaron a Gemini 3.1 Flash-Lite, una inteligencia muchísimo más rápida pensada para emprendedores que necesitan hacer 10.000 tareas automáticas de golpe sin arruinarse pagando.",
    accent: "from-cyan-300 via-sky-500 to-indigo-600",
    glow: "bg-sky-300/30",
    image: "/images/tendencias/3f0b63682c405e9c5b70bcbb834efe37.jpg",
  },
  {
    title: "La próxima generación de cerebros para la IA",
    description:
      "NVIDIA, la empresa que fabrica las 'placas madre' de las inteligencias artificiales, anunció Rubin. Serán el corazón de la IA para que razonen mucho más como humanos.",
    accent: "from-fuchsia-300 via-pink-500 to-violet-600",
    glow: "bg-fuchsia-300/30",
    image: "/images/tendencias/fe196a3f0e0aa1a5f022f95b626c0f9d.jpg",
  },
  {
    title: "La IA ya empieza a usar el mouse por vos",
    description:
      "Los creadores de Claude probaron un modelo de IA que literalmente toma control de tu computadora (Mac) para organizar tus archivos y cliquear programas autónomamente.",
    accent: "from-emerald-300 via-teal-500 to-cyan-600",
    glow: "bg-emerald-300/30",
    image: "/images/tendencias/f57b5c5b5bee379afb03805e94b4b462.jpg",
  },
  {
    title: "Los bots que trabajan solos ya son reales",
    description:
      "Muchas startups están lanzando software que no te pide chatear, sino que vos le decis 'Buscá los mejores clientes en internet y preparales un email a cada uno', y lo hace.",
    accent: "from-zinc-300 via-zinc-400 to-zinc-500",
    glow: "bg-zinc-300/30",
    image: "/images/tendencias/f39cb2c7bc7c67bc80018275b488c78e.jpg",
  },
] as const;

const Radar = () => {
  return (
    <div className="min-h-full bg-background pb-0 pt-0">
      <div className="flex w-full flex-col gap-10">
        <section className="space-y-4">
          <CinematicSlider items={trendItems} />
        </section>
      </div>

      <FinalCTA 
        title="Mantenete a la vanguardia"
        description="La IA evoluciona cada día. No te quedes atrás y seguí explorando las herramientas que están cambiando el mercado."
        buttonText="Ver herramientas"
        to={routes.appTools}
      />
    </div>
  );
};

export default Radar;
