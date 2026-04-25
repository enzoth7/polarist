import { CinematicSlider } from "@/components/radar/CinematicSlider";
import { RadarMetricsBoard } from "@/components/radar/RadarMetricsBoard";
import { FinalCTA } from "@/components/layout/FinalCTA";
import { useTrends } from "@/hooks/useTrends";
import { routes } from "@/lib/routes";

const Radar = () => {
  const { data: trendItems = [], isLoading, error } = useTrends();

  return (
    <div className="min-h-full bg-[#F6F6F6] pb-0 pt-0 text-[#010101]">
      <div className="flex w-full flex-col gap-10 pb-16 md:pb-24">
        <section className="space-y-4">
          {isLoading ? (
            <div className="flex h-[clamp(500px,85vh,900px)] items-center justify-center">
              <span className="text-sm text-[#010101]/55">Cargando tendencias...</span>
            </div>
          ) : error ? (
            <div className="flex h-[clamp(500px,85vh,900px)] items-center justify-center">
              <span className="text-sm text-[#010101]/55">No se pudieron cargar las tendencias.</span>
            </div>
          ) : (
            <CinematicSlider items={trendItems} />
          )}
        </section>

        <RadarMetricsBoard />
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
