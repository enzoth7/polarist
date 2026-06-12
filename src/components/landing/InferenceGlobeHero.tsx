import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { MaskedSlideReveal } from "@/components/ui/masked-slide-reveal";
import { ShinyButton } from "@/components/ui/shiny-button";
import { StaticGlobe } from "@/components/ui/StaticGlobe";
import { Button } from "@/components/ui/button";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const InferenceGlobeHero = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sphereTargetRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' ? window.matchMedia("(max-width: 768px)").matches : false;
  const isBot = typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

  const handleScrollDown = () => {
    const nextSection = document.getElementById("landing-problems");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useGSAP(
    () => {
      const titleEl = titleRef.current;
      const ctaEl = ctaRef.current;
      const rootEl = rootRef.current;

      if (!titleEl || !ctaEl || !rootEl) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || isBot;

      // Force instant visibility for bots or reduced motion users as early as possible
      if (prefersReducedMotion) {
        gsap.set([titleEl, ctaEl, scrollIndicatorRef.current], { opacity: 1, y: 0, scale: 1 });
      }

      if (isMobile) {
        const introTl = gsap.timeline();
        if (!prefersReducedMotion) {
          introTl.to(titleEl, { duration: 1.2, opacity: 1, y: 0, ease: "power4.out" }, 0.5);
          introTl.to(ctaEl, { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)" }, "-=0.55");
        }
        return () => introTl.kill();
      }

      const sphereTarget = sphereTargetRef.current;
      if (!sphereTarget) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = isMobile ? 8 : 6.5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      sphereTarget.innerHTML = "";
      sphereTarget.appendChild(renderer.domElement);

      const particleCount = isMobile ? 30000 : 50000;
      const positions = new Float32Array(particleCount * 3);
      const simulationPositions = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);


      const wovenGeometry = new THREE.BufferGeometry();

      for (let i = 0; i < particleCount; i++) {
        const radius = 2.2 + (Math.random() - 0.5) * 0.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        simulationPositions[i * 3] = x;
        simulationPositions[i * 3 + 1] = y;
        simulationPositions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        const color = new THREE.Color(0xFFFFFF);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;
      }

      wovenGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      wovenGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext('2d');
      if (context) {
        context.beginPath();
        context.arc(16, 16, 16, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
      }
      const texture = new THREE.CanvasTexture(canvas);

      const wovenMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.008 : 0.011,
        vertexColors: true,
        blending: THREE.NormalBlending,
        transparent: true,
        opacity: 0.92,
        depthWrite: true,
        depthTest: true,
        map: texture,
        alphaTest: 0.1
      });

      const wovenPoints = new THREE.Points(wovenGeometry, wovenMaterial);
      scene.add(wovenPoints);

      const clock = new THREE.Clock();

      const pointerNdc = new THREE.Vector2(2, 2);
      const raycaster = new THREE.Raycaster();
      const interactionSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.95);
      const intersectionPoint = new THREE.Vector3();
      const shellCursorLocal = new THREE.Vector3();
      const coreCursorLocal = new THREE.Vector3();
      let pointerInside = false;
      let pointerTargetStrength = 0;
      let pointerStrength = 0;


      const fitRenderer = () => {
        const width = sphereTarget.clientWidth;
        const height = sphereTarget.clientHeight;

        if (width === 0 || height === 0) {
          return;
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      fitRenderer();




      const updatePointerFromEvent = (event: PointerEvent) => {
        const rect = sphereTarget.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          return;
        }

        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        const isInside = x >= -1 && x <= 1 && y >= -1 && y <= 1;

        pointerInside = isInside;
        pointerTargetStrength = isInside ? 1 : 0;
        pointerNdc.set(x, y);
      };

      const clearPointerInfluence = () => {
        pointerInside = false;
        pointerTargetStrength = 0;
        pointerNdc.set(2, 2);
      };

      const clamp = (value: number, min: number, max: number) =>
        Math.min(max, Math.max(min, value));

      let frameId = 0;
      const animate = () => {
        frameId = window.requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        const fovRad = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
        const visibleWidth = visibleHeight * camera.aspect;
        const mouseWorld = new THREE.Vector3((pointerNdc.x * visibleWidth) / 2, (pointerNdc.y * visibleHeight) / 2, 0);

        // Convert mouse position to the sphere's local space to account for its rotation
        wovenPoints.updateMatrixWorld();
        const localMouse = mouseWorld.clone();
        wovenPoints.worldToLocal(localMouse);

        // Precalculate the world +Z vector in local space to identify the front hemisphere efficiently
        const angle = wovenPoints.rotation.y;
        const localZDirX = -Math.sin(angle); // Fixed inverse rotation sign
        const localZDirZ = Math.cos(angle);

        const posArray = wovenGeometry.attributes.position.array;
        const hiddenDistance = 9999;

        for (let i = 0; i < particleCount; i++) {
          const ix = i * 3;
          const iy = i * 3 + 1;
          const iz = i * 3 + 2;

          const currentPos = new THREE.Vector3(
            simulationPositions[ix],
            simulationPositions[iy],
            simulationPositions[iz],
          );
          const originalPos = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
          const velocity = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

          // Check if particle's resting position is currently on the front hemisphere relative to the camera
          const isFrontHemisphere = (originalPos.x * localZDirX + originalPos.z * localZDirZ) > 0;

          if (pointerInside && isFrontHemisphere) {
            const dist = currentPos.distanceTo(localMouse);
            const influence = isMobile ? 1.8 : 2.8;
            if (dist < influence) {
              const force = (influence - dist) * 0.022;
              const direction = new THREE.Vector3().subVectors(currentPos, localMouse).normalize();
              velocity.add(direction.multiplyScalar(force));
            }
          }

          // Return to original position
          const returnForce = new THREE.Vector3().subVectors(originalPos, currentPos).multiplyScalar(0.003);
          velocity.add(returnForce);

          // Damping
          velocity.multiplyScalar(0.92);

          simulationPositions[ix] += velocity.x;
          simulationPositions[iy] += velocity.y;
          simulationPositions[iz] += velocity.z;

          velocities[ix] = velocity.x;
          velocities[iy] = velocity.y;
          velocities[iz] = velocity.z;

          if (isFrontHemisphere) {
            posArray[ix] = simulationPositions[ix];
            posArray[iy] = simulationPositions[iy];
            posArray[iz] = simulationPositions[iz];
          } else {
            posArray[ix] = hiddenDistance;
            posArray[iy] = hiddenDistance;
            posArray[iz] = hiddenDistance;
          }
        }
        wovenGeometry.attributes.position.needsUpdate = true;

        wovenPoints.rotation.y = elapsedTime * 0.05;


        renderer.render(scene, camera);
      };

      if (!prefersReducedMotion) {
        animate();
      } else {
        renderer.render(scene, camera);
      }

      const introTl = gsap.timeline();

      if (!prefersReducedMotion) {
        introTl.to(titleEl, { duration: 1.2, opacity: 1, y: 0, ease: "power4.out" }, 0.5);
        introTl.to(
          ctaEl,
          { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)" },
          "-=0.55",
        );
        introTl.to(
          scrollIndicatorRef.current,
          { duration: 0.8, opacity: 1, y: 0, ease: "power2.out" },
          "-=0.4"
        );

        gsap.fromTo(wovenPoints.position, { y: -2 }, { y: 0, duration: 2, ease: "power2.out" });
        gsap.fromTo(wovenMaterial, { opacity: 0 }, { opacity: 0.92, duration: 2, ease: "power2.out" });
      }

      const handlePointerMove = (event: PointerEvent) => {
        updatePointerFromEvent(event);

        const rect = rootEl.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;


      };

      const clearAllPointerInfluence = () => {
        clearPointerInfluence();

      };

      const handleResize = () => {
        fitRenderer();

      };

      rootEl.addEventListener("pointermove", handlePointerMove);
      rootEl.addEventListener("pointerleave", clearAllPointerInfluence);
      window.addEventListener("blur", clearAllPointerInfluence);
      window.addEventListener("resize", handleResize);

      return () => {
        introTl.kill();
        rootEl.removeEventListener("pointermove", handlePointerMove);
        rootEl.removeEventListener("pointerleave", clearAllPointerInfluence);
        window.removeEventListener("blur", clearAllPointerInfluence);
        window.removeEventListener("resize", handleResize);

        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }

        wovenGeometry.dispose();
        wovenMaterial.dispose();
        renderer.dispose();

        if (sphereTarget.contains(renderer.domElement)) {
          sphereTarget.removeChild(renderer.domElement);
        }
      };
    },
    { scope: rootRef, revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative h-[100dvh] w-full overflow-hidden",
        isMobile ? "flex flex-col justify-start pt-4 pb-12" : ""
      )}
      style={{ background: 'var(--polarist-black, #010101)' }}
    >
      {isMobile ? (
        /* Mobile Sphere Container at the top to prevent overlap */
        <div className="w-full flex items-center justify-center shrink-0 h-[34dvh] min-h-[270px] z-10 pt-2">
          <StaticGlobe width="100%" height="100%" className="max-w-[320px] max-h-[320px]" />
        </div>
      ) : null}

      <div className={cn(
        "relative z-20 flex px-8 md:px-16 lg:px-24",
        isMobile
          ? "w-full flex-col flex-1 justify-start items-center pb-2 pt-4"
          : "h-full w-full flex-col justify-end pb-[28vh] items-start"
      )}>
        <div className="pointer-events-none w-full max-w-4xl text-left">
          <div ref={titleRef} className="translate-y-6 opacity-0">
            <h1
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(3.1rem,7.5vw,6rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 0.95, color: 'var(--polarist-white, #F6F6F6)' }}
              className="mb-6"
            >
              Tu camino más <br className="hidden md:block" />fácil <span className="text-[#CAFE5B]">hacia la IA</span>
            </h1>
            <p
              className={cn("mt-10 max-w-[580px] leading-relaxed", isMobile ? "text-center mx-auto" : "text-left")}
              style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? '14px' : '18px', fontWeight: 400, color: 'rgba(246,246,246,0.65)', letterSpacing: '0px' }}
            >
              Asesoramos e implementamos Agentes de IA para transformar, acelerar y mejorar tu negocio.
            </p>
          </div>

          <div
            ref={ctaRef}
            className={cn(
              "pointer-events-auto translate-y-4 opacity-0 flex",
              isMobile
                ? "flex-col w-full max-w-[320px] mx-auto gap-3 mt-10 items-stretch"
                : "flex-row items-center gap-4 justify-start mt-10"
            )}
          >
            <Link
              to={routes.services}
              className={cn(
                "inline-flex items-center justify-center font-bold tracking-[0.5px] transition-all hover:scale-[1.05]",
                isMobile ? "text-[15px] px-8" : "px-10 text-[16px]"
              )}
              style={{
                fontFamily: "var(--font-sans)",
                background: "#CAFE5B",
                color: "#010101",
                height: isMobile ? "48px" : "56px",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
                border: "none",
                boxShadow: "0px 8px 32px rgba(202, 254, 91, 0.25)"
              }}
            >
              Soluciones para empresas
            </Link>

            <Link
              to={routes.appResources}
              className={cn(
                "inline-flex items-center justify-center font-bold tracking-[0.5px] transition-all hover:scale-[1.05]",
                isMobile ? "text-[15px] px-8" : "px-10 text-[16px]"
              )}
              style={{
                fontFamily: "var(--font-sans)",
                background: "#F6F6F6",
                color: "#010101",
                height: isMobile ? "48px" : "56px",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
                border: "none",
              }}
            >
              Empezar a usar IA
            </Link>
          </div>
        </div>
      </div>

      {!isMobile ? (
        /* Desktop-only absolute-positioned Three.js sphere container */
        <div className="pointer-events-none absolute inset-0 z-10 flex w-full h-full items-center justify-center overflow-hidden">
          <div
            ref={sphereTargetRef}
            className="absolute inset-0 w-full h-full"
            style={{ transform: 'translateX(26%) scale(0.95)' }}
          />
        </div>
      ) : null}

      {/* Scroll chevrons indicator */}
      <style>{`
        @keyframes scroll-chevron {
          0% {
            transform: translateY(0);
            opacity: 0.25;
          }
          50% {
            transform: translateY(6px);
            opacity: 0.85;
          }
          100% {
            transform: translateY(0);
            opacity: 0.25;
          }
        }
        .animate-scroll-chevron {
          animation: scroll-chevron 2s ease-in-out infinite;
        }
      `}</style>
      <div
        ref={scrollIndicatorRef}
        onClick={handleScrollDown}
        className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-30 cursor-pointer flex flex-col items-center gap-0 select-none group opacity-0 translate-y-2 transition-all duration-300"
        title="Deslizar hacia abajo"
      >
        <ChevronDown className="h-6 w-6 text-white/50 group-hover:text-[#CAFE5B] transition-colors duration-300 animate-scroll-chevron" />
        <ChevronDown className="h-6 w-6 text-white/30 group-hover:text-[#CAFE5B] transition-colors duration-300 animate-scroll-chevron [animation-delay:0.25s] -mt-3.5" />
      </div>
    </div>
  );
};

export default InferenceGlobeHero;
