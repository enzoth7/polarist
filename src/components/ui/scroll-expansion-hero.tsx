import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollExpandMediaProps {
  mediaSrc: string;
  bgImageSrc: string;
  titleLeft?: string;
  titleRight?: string;
}

const ScrollExpandMedia = ({
  mediaSrc,
  bgImageSrc,
  titleLeft = 'EL PODER',
  titleRight = 'SIMPLICIDAD',
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInnerRef = useRef<HTMLImageElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLHeadingElement>(null);
  const textRightRef = useRef<HTMLHeadingElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=70%', // Aún más reducido para evitar sensación de "trancado" al final
        scrub: 0.1, // Respuesta casi inmediata
        pin: true,
      },
    });

    // Añadir una pequeña pausa al principio para que el usuario registre que se ancló la sección antes de expandir
    tl.to({}, { duration: 0.05 });

    // Estado inicial performante usando clip-path. Más pequeño (más inset)
    gsap.set(mediaRef.current, {
      clipPath: window.innerWidth < 768 
        ? 'inset(35% 25% round 2rem)' // Mobile: más alto que ancho, más chico
        : 'inset(30% 38% round 2rem)', // Desktop: proporcionado, más chico en el medio
    });

    // Expand the media container to full width and height
    tl.to(
      mediaRef.current,
      {
        clipPath: 'inset(0% 0% round 0rem)',
        ease: 'none',
      },
      0
    );

    // Subtle scale inside the media for parallax effect
    tl.to(
      mediaInnerRef.current,
      {
        scale: 1,
        ease: 'none',
      },
      0
    );

    // Move texts apart
    tl.to(
      textLeftRef.current,
      {
        x: '-60vw',
        opacity: 0,
        ease: 'power1.inOut',
      },
      0
    );

    tl.to(
      textRightRef.current,
      {
        x: '60vw',
        opacity: 0,
        ease: 'power1.inOut',
      },
      0
    );

    // Fade out background and text container
    tl.to(
      [bgRef.current, textContainerRef.current],
      {
        opacity: 0,
        ease: 'none',
      },
      0.5 // Start fading midway through the expansion
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      <div
        ref={stickyRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* Background Image that fades out */}
        <div ref={bgRef} className="absolute inset-0 z-0 h-full w-full">
          <img
            src={bgImageSrc}
            alt="Background"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* The Text split in the background */}
        <div
          ref={textContainerRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between"
        >
          {/* Espacio Izquierdo (centrado en el hueco lateral) */}
          <div className="flex-1 flex items-center justify-center h-full">
            <h2
              ref={textLeftRef}
              className="text-2xl md:text-4xl lg:text-[3.5vw] font-bold tracking-tight text-white opacity-90 text-center leading-none"
              style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
            >
              {titleLeft}
            </h2>
          </div>

          {/* Espacio central reservado para la imagen (no texto aquí) */}
          <div className="w-[24%] md:w-[24%] h-full shrink-0" />

          {/* Espacio Derecho (centrado en el hueco lateral) */}
          <div className="flex-1 flex items-center justify-center h-full">
            <h2
              ref={textRightRef}
              className="text-2xl md:text-4xl lg:text-[3.5vw] font-bold tracking-tight text-white opacity-90 text-center leading-none"
              style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
            >
              {titleRight}
            </h2>
          </div>
        </div>

        {/* The Expanding Media Container */}
        <div
          ref={mediaRef}
          className="relative z-20 h-screen w-screen overflow-hidden shadow-[0_0_50px_rgba(202,254,91,0.3)]"
          style={{ willChange: 'clip-path' }}
        >
          <img
            ref={mediaInnerRef}
            src={mediaSrc}
            alt="Media content"
            className="h-full w-full scale-110 object-cover"
            style={{ willChange: 'transform' }}
          />
          {/* A slight dark overlay when fully expanded can be managed here if needed */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
