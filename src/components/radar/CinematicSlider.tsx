import { useEffect, useState } from "react";
import { Autoplay, EffectCreative } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-creative";

type CinematicSliderItem = {
  title: string;
  description: string;
  image: string;
  accent: string;
  glow: string;
};

type CinematicSliderProps = {
  items: readonly CinematicSliderItem[];
};

const AUTOPLAY_MS = 6800;

export function CinematicSlider({ items }: CinematicSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const canNavigate = items.length > 1;

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate flex h-[clamp(500px,85vh,900px)] flex-col overflow-x-clip text-white">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {items.map((item, index) => (
          <div
            key={`radar-bg-${item.title}`}
            className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-out"
            style={{
              backgroundImage: `url(${item.image})`,
              filter: "blur(50px)",
              transform: "scale(1.12)",
              opacity: activeIndex === index ? 0.55 : 0,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(212,255,0,0.16),rgba(212,255,0,0.05)_38%,transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.16),rgba(0,0,0,0.74)_58%,rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <Swiper
          modules={[EffectCreative, Autoplay]}
          className="radar-swiper !w-full !overflow-visible px-4 md:px-8 xl:px-12"
          effect="creative"
          centeredSlides
          slidesPerView="auto"
          loop={canNavigate}
          loopedSlides={items.length}
          loopAdditionalSlides={items.length}
          watchSlidesProgress
          grabCursor={canNavigate}
          allowTouchMove={canNavigate}
          speed={960}
          autoplay={
            canNavigate ?
              {
                delay: AUTOPLAY_MS,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
          }
          onRealIndexChange={(swiper: SwiperType) => {
            setActiveIndex(swiper.realIndex);
          }}
          creativeEffect={{
            perspective: true,
            limitProgress: 2,
            prev: {
              translate: ["-120%", 0, -500],
              rotate: [0, 25, 0],
              scale: 0.8,
              shadow: true,
            },
            next: {
              translate: ["120%", 0, -500],
              rotate: [0, -25, 0],
              scale: 0.8,
              shadow: true,
            },
          }}
        >
          {items.map((item) => (
            <SwiperSlide
              key={item.title}
              className="radar-swiper-slide !h-auto !w-[clamp(220px,24vw,330px)] !overflow-visible"
            >
              <article className="radar-card group relative aspect-[9/16] overflow-hidden rounded-3xl border border-white/16 bg-black/20 shadow-[0_30px_85px_-35px_rgba(0,0,0,0.95)]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/28 to-black/10" />
                <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_30%,rgba(255,255,255,0)_66%)]" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h2 className="text-balance text-lg font-bold leading-tight tracking-tight text-white md:text-xl">
                    {item.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-[0.86rem] leading-relaxed text-white/78 md:text-[0.92rem]">
                    {item.description}
                  </p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export type { CinematicSliderItem };
