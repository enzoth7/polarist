import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_SYNC_DISTANCE = '+=100%';
const SCROLL_SCRUB_SECONDS = 0.28;
const VIDEO_TIME_EASE_SECONDS = 0.18;

interface FrameSequenceConfig {
  basePath: string;
  frameCount: number;
  extension?: string;
  padLength?: number;
}

interface ScrollExpandMediaProps {
  mediaSrc: string;
  bgImageSrc: string;
  frameSequence?: FrameSequenceConfig;
  titleLeft?: string;
  titleRight?: string;
}

const isVideoAsset = (assetPath: string) => assetPath.toLowerCase().endsWith('.mp4');

const getFrameSrc = ({
  basePath,
  extension = 'webp',
  padLength = 3,
}: FrameSequenceConfig, index: number) =>
  `${basePath}/frame-${String(index + 1).padStart(padLength, '0')}.${extension}`;

const drawImageCover = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
  const context = canvas.getContext('2d');
  if (!context || !image.naturalWidth || !image.naturalHeight) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(canvas.clientWidth, 1);
  const height = Math.max(canvas.clientHeight, 1);
  const targetWidth = Math.round(width * dpr);
  const targetHeight = Math.round(height * dpr);

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  const scale = Math.max(
    targetWidth / image.naturalWidth,
    targetHeight / image.naturalHeight,
  );
  const sourceWidth = targetWidth / scale;
  const sourceHeight = targetHeight / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.clearRect(0, 0, targetWidth, targetHeight);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );
};

const renderAnimatedTitle = (text: string) =>
  text.split('').map((char, index) => (
    <span
      key={`${char}-${index}`}
      data-scroll-title-char
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

const ScrollExpandMedia = ({
  mediaSrc,
  bgImageSrc,
  frameSequence,
  titleLeft = 'EL PODER',
  titleRight = 'SIMPLICIDAD',
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInnerRef = useRef<HTMLImageElement | HTMLVideoElement | HTMLCanvasElement>(null);
  const mediaVideoRef = useRef<HTMLVideoElement | null>(null);
  const sequenceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawSequenceProgressRef = useRef<(progress: number) => void>(() => {});
  const bgRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLHeadingElement>(null);
  const textRightRef = useRef<HTMLHeadingElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const mediaIsVideo = isVideoAsset(mediaSrc);
  const bgIsVideo = isVideoAsset(bgImageSrc);
  const useFrameSequence = mediaIsVideo && Boolean(frameSequence);

  useEffect(() => {
    if (!frameSequence || !sequenceCanvasRef.current) {
      drawSequenceProgressRef.current = () => {};
      return;
    }

    const canvas = sequenceCanvasRef.current;
    const images: HTMLImageElement[] = [];
    const loadedFrames = new Set<number>();
    let currentFrame = 0;
    let lastDrawnFrame = -1;
    let cancelled = false;

    const drawFrame = (frameIndex: number, force = false) => {
      const image = images[frameIndex];
      if (!image || !loadedFrames.has(frameIndex)) return;
      if (!force && frameIndex === lastDrawnFrame) return;
      drawImageCover(canvas, image);
      lastDrawnFrame = frameIndex;
    };

    const drawProgress = (progress: number) => {
      currentFrame = Math.min(
        frameSequence.frameCount - 1,
        Math.max(0, Math.round(progress * (frameSequence.frameCount - 1))),
      );
      drawFrame(currentFrame);
    };

    drawSequenceProgressRef.current = drawProgress;

    Array.from({ length: frameSequence.frameCount }, (_, frameIndex) => {
      const image = new Image();
      images[frameIndex] = image;
      image.decoding = 'async';
      image.loading = 'eager';
      image.onload = () => {
        if (cancelled) return;
        loadedFrames.add(frameIndex);
        if (frameIndex === 0 || frameIndex === currentFrame) {
          drawFrame(frameIndex);
        }
      };
      image.src = getFrameSrc(frameSequence, frameIndex);
    });

    const handleResize = () => {
      lastDrawnFrame = -1;
      drawFrame(currentFrame, true);
    };

    window.addEventListener('resize', handleResize);
    requestAnimationFrame(() => drawProgress(0));

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      images.forEach((image) => {
        image.onload = null;
      });
    };
  }, [
    frameSequence?.basePath,
    frameSequence?.extension,
    frameSequence?.frameCount,
    frameSequence?.padLength,
  ]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const titleChars = containerRef.current.querySelectorAll('[data-scroll-title-char]');
    const mediaVideo = mediaVideoRef.current;
    const videoScrub = { progress: 0 };
    let scrubToVideoTime: ((value: number) => void) | undefined;

    const getVideoTimeFromProgress = () => {
      if (!mediaVideo || !Number.isFinite(mediaVideo.duration) || mediaVideo.duration <= 0) return;
      const finalFrameTime = Math.max(mediaVideo.duration - 1 / 60, 0);

      if (videoScrub.progress <= 0.001) return 0;
      if (videoScrub.progress >= 0.999) return finalFrameTime;

      return finalFrameTime * videoScrub.progress;
    };

    const syncVideoProgress = (immediate = false) => {
      if (!mediaVideo) return;
      const nextTime = getVideoTimeFromProgress();
      if (typeof nextTime !== 'number') return;

      if (immediate) {
        mediaVideo.currentTime = nextTime;
        return;
      }

      scrubToVideoTime ??= gsap.quickTo(mediaVideo, 'currentTime', {
        duration: VIDEO_TIME_EASE_SECONDS,
        ease: 'power2.out',
      });

      scrubToVideoTime(nextTime);
    };

    gsap.fromTo(
      titleChars,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.03,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      },
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: SCROLL_SYNC_DISTANCE,
        scrub: SCROLL_SCRUB_SECONDS,
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

    if (useFrameSequence) {
      tl.to(
        videoScrub,
        {
          progress: 1,
          ease: 'none',
          onUpdate: () => drawSequenceProgressRef.current(videoScrub.progress),
          onComplete: () => drawSequenceProgressRef.current(1),
          onReverseComplete: () => drawSequenceProgressRef.current(0),
        },
        0
      );

      return;
    }

    if (mediaIsVideo && mediaVideo) {
      mediaVideo.pause();
      mediaVideo.currentTime = 0;

      const handleLoadedMetadata = () => {
        syncVideoProgress(true);
      };

      mediaVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
      mediaVideo.addEventListener('canplay', handleLoadedMetadata);

      tl.to(
        videoScrub,
        {
          progress: 1,
          ease: 'none',
          onUpdate: syncVideoProgress,
          onComplete: () => syncVideoProgress(true),
          onReverseComplete: () => syncVideoProgress(true),
        },
        0
      );

      return () => {
        mediaVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
        mediaVideo.removeEventListener('canplay', handleLoadedMetadata);
      };
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      <div
        ref={stickyRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* Background Image that fades out */}
        <div ref={bgRef} className="absolute inset-0 z-0 h-full w-full">
          {bgIsVideo ? (
            <video
              src={bgImageSrc}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-80"
              aria-label="Background"
            />
          ) : (
            <img
              src={bgImageSrc}
              alt="Background"
              className="h-full w-full object-cover opacity-80"
            />
          )}
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
              {renderAnimatedTitle(titleLeft)}
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
              {renderAnimatedTitle(titleRight)}
            </h2>
          </div>
        </div>

        {/* The Expanding Media Container */}
        <div
          ref={mediaRef}
          className="relative z-20 h-screen w-screen overflow-hidden shadow-[0_0_50px_rgba(202,254,91,0.3)]"
          style={{ willChange: 'clip-path' }}
        >
          {useFrameSequence ? (
            <canvas
              ref={(node) => {
                mediaInnerRef.current = node;
                sequenceCanvasRef.current = node;
              }}
              className="h-full w-full scale-110"
              style={{ willChange: 'transform' }}
              role="img"
              aria-label="Media content"
            />
          ) : mediaIsVideo ? (
            <video
              ref={(node) => {
                mediaInnerRef.current = node;
                mediaVideoRef.current = node;
              }}
              src={mediaSrc}
              muted
              playsInline
              preload="auto"
              className="h-full w-full scale-110 object-cover"
              style={{ willChange: 'transform' }}
              aria-label="Media content"
            />
          ) : (
            <img
              ref={mediaInnerRef}
              src={mediaSrc}
              alt="Media content"
              className="h-full w-full scale-110 object-cover"
              style={{ willChange: 'transform' }}
            />
          )}
          {/* A slight dark overlay when fully expanded can be managed here if needed */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
