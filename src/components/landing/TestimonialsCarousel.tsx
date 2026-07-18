/**
 * 💡 CONFIGURACIÓN DE TESTIMONIOS (TESTIMONIALS CONFIGURATION)
 * -------------------------------------------------------------
 * Aquí puedes agregar, editar o eliminar los testimonios que aparecen en el carrusel.
 * Cada elemento en el array `testimonials` soporta:
 * - id: Identificador único.
 * - type: "brand" (empresa/marca) o "person" (profesional/persona).
 * - name: Nombre de la empresa o persona.
 * - subText: Cargo, especialidad o sector.
 * - avatar: URL de la imagen (para personas) o un componente ReactNode/SVG (para marcas).
 * - quote: La frase o testimonio (se ajusta automáticamente a dos líneas).
 * - instagramUrl: (Opcional) URL de Instagram para hacer que el avatar/logo sea cliqueable.
 */

import React from "react";

interface TestimonialItem {
  id: number;
  type: "brand" | "person";
  name: string;
  subText: string;
  avatar: string | React.ReactNode;
  quote: string;
  instagramUrl?: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    type: "brand",
    name: "Matearte",
    subText: "Ecommerce internacional",
    instagramUrl: "https://www.instagram.com/matearteuruguay/",
    avatar: "/logos/clients/matearte.jpg", 

    quote: "El rediseño de nuestras operaciones nos hizo escalar.",
  },
  {
    id: 2,
    type: "person",
    name: "Liliana Portugal",
    subText: "Lider de ventas",
    instagramUrl: "",
    avatar: "/images/testimonials/Anonimo.png",
    quote: "La asesoría con ellos nos hizo ver oportunidades y herramientas que no habíamos considerado.",
  },
  {
    id: 3,
    type: "brand",
    name: "CCI Paysandú",
    subText: "Apoyo a emprendedores",
    instagramUrl: "https://www.instagram.com/ccipaysandu/",
    avatar: "/logos/clients/ccip.jpg",
    quote: "La charla brindada fue un antes y un después para nosotros.",
  },
  {
    id: 4,
    type: "person",
    name: "Martin Vanzini",
    subText: "Paisajista profesional",
    instagramUrl: "",
    avatar: "/images/testimonials/Anonimo.png",
    quote: "El equipo de Polarist me ayudó a ahorrar mucho tiempo.",
  },
];

const CardItem = ({ item }: { item: TestimonialItem }) => {
  const AvatarContent = typeof item.avatar === "string" ? (
    <img
      src={item.avatar}
      alt={item.name}
      className="w-full h-full object-cover select-none avatar-circle"
      loading="lazy"
    />
  ) : (
    item.avatar
  );

  return (
    <div className="flex flex-col items-center text-center w-[260px] md:w-[280px] p-6 transition-all duration-500 ease-out select-none flex-shrink-0">
      {item.instagramUrl ? (
        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-20 h-20 md:w-24 md:h-24 avatar-circle flex items-center justify-center bg-white/[0.02] border border-white/[0.08] hover:border-[#CAFE5B]/60 hover:scale-105 transition-all duration-300 overflow-hidden mb-4 shadow-lg flex-shrink-0 cursor-pointer pointer-events-auto"
        >
          {AvatarContent}
        </a>
      ) : (
        <div className="w-20 h-20 md:w-24 md:h-24 avatar-circle flex items-center justify-center bg-white/[0.02] border border-white/[0.08] hover:border-[#CAFE5B]/40 transition-all duration-300 overflow-hidden mb-4 shadow-lg flex-shrink-0">
          {AvatarContent}
        </div>
      )}
      <h3 className="text-white text-base md:text-lg font-bold font-sans tracking-tight leading-snug">
        {item.name}
      </h3>
      <p className="text-xs text-white/40 font-medium mb-3">
        {item.subText}
      </p>
      <p className="text-base md:text-[1.05rem] text-white/90 italic font-serif leading-relaxed px-2 w-full max-w-[260px] md:max-w-[290px] whitespace-normal">
        "{item.quote}"
      </p>
    </div>
  );
};

export const TestimonialsCarousel = () => {
  // Combine all testimonials into a single track and duplicate to ensure continuous marquee flow
  const duplicatedItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0516] py-14 border-t border-white/[0.05]">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[#8B5BF5]/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-[#8B5BF5]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-6 text-center mb-10 relative z-10">
        <p className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
          Empresas y profesionales que <span className="text-[#CAFE5B]">confían</span> en nosotros
        </p>
      </div>

      {/* Single Marquee Track */}
      <div className="relative w-full flex items-center overflow-hidden select-none mask-image-marquee">
        <div className="flex gap-6 animate-marquee whitespace-nowrap pause-on-hover py-4">
          {duplicatedItems.map((item, idx) => (
            <CardItem key={`${item.id}-t1-${idx}`} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        .mask-image-marquee {
          mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
        }
        .avatar-circle {
          border-radius: 9999px !important;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
