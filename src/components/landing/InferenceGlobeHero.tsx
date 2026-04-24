import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import { Link } from "react-router-dom";

import { routes } from "@/lib/routes";

const InferenceGlobeHero = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const backgroundStarsRef = useRef<HTMLDivElement>(null);
  const sphereTargetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sphereTarget = sphereTargetRef.current;
      const backgroundStars = backgroundStarsRef.current;
      const titleEl = titleRef.current;
      const descriptionEl = descriptionRef.current;
      const ctaEl = ctaRef.current;

      if (!sphereTarget || !backgroundStars || !titleEl || !descriptionEl || !ctaEl) {
        return;
      }

      const rootEl = rootRef.current;

      if (!rootEl) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      sphereTarget.innerHTML = "";
      sphereTarget.appendChild(renderer.domElement);

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const particleCount = isMobile ? 2600 : 4500;
      const coreCount = isMobile ? 1400 : 2500;

      const shellGeometry = new THREE.BufferGeometry();
      const shellPositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 2.6 + Math.random() * 0.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        shellPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        shellPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        shellPositions[i + 2] = radius * Math.cos(phi);
      }

      shellGeometry.setAttribute("position", new THREE.BufferAttribute(shellPositions, 3));
      const shellBasePositions = new Float32Array(shellPositions);

      const shellMaterial = new THREE.PointsMaterial({
        size: 0.013,
        color: 0xffffff,
        transparent: true,
        opacity: 0.62,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });

      const shell = new THREE.Points(shellGeometry, shellMaterial);
      scene.add(shell);

      const coreGeometry = new THREE.BufferGeometry();
      const corePositions = new Float32Array(coreCount * 3);

      for (let i = 0; i < coreCount * 3; i += 3) {
        const radius = Math.random() * 1.3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        corePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        corePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        corePositions[i + 2] = radius * Math.cos(phi);
      }

      coreGeometry.setAttribute("position", new THREE.BufferAttribute(corePositions, 3));
      const coreBasePositions = new Float32Array(corePositions);

      const coreMaterial = new THREE.PointsMaterial({
        size: 0.022,
        color: 0xccff00,
        transparent: true,
        opacity: 0.9,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });

      const core = new THREE.Points(coreGeometry, coreMaterial);
      scene.add(core);

      const pointerNdc = new THREE.Vector2(2, 2);
      const raycaster = new THREE.Raycaster();
      const interactionSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.95);
      const intersectionPoint = new THREE.Vector3();
      const shellCursorLocal = new THREE.Vector3();
      const coreCursorLocal = new THREE.Vector3();
      let pointerInside = false;
      let pointerTargetStrength = 0;
      let pointerStrength = 0;

      const displaceParticles = (
        positions: Float32Array,
        basePositions: Float32Array,
        cursorLocal: THREE.Vector3,
        cursorActive: boolean,
        strength: number,
        influenceRadius: number,
        pushScale: number,
        zBoost: number,
        lerpFactor: number,
      ) => {
        const influenceRadiusSquared = influenceRadius * influenceRadius;

        for (let i = 0; i < positions.length; i += 3) {
          const baseX = basePositions[i];
          const baseY = basePositions[i + 1];
          const baseZ = basePositions[i + 2];

          let targetX = baseX;
          let targetY = baseY;
          let targetZ = baseZ;

          if (cursorActive && strength > 0.001) {
            const deltaX = baseX - cursorLocal.x;
            const deltaY = baseY - cursorLocal.y;
            const deltaZ = baseZ - cursorLocal.z;
            const distanceSquared = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;

            if (distanceSquared < influenceRadiusSquared) {
              const distance = Math.sqrt(distanceSquared) + 0.0001;
              const falloff = 1 - distance / influenceRadius;
              const push = falloff * falloff * pushScale * strength;

              targetX += (deltaX / distance) * push;
              targetY += (deltaY / distance) * push;
              targetZ += (deltaZ / distance) * push + push * zBoost;
            }
          }

          positions[i] += (targetX - positions[i]) * lerpFactor;
          positions[i + 1] += (targetY - positions[i + 1]) * lerpFactor;
          positions[i + 2] += (targetZ - positions[i + 2]) * lerpFactor;
        }
      };

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

      type BackgroundStar = {
        element: HTMLSpanElement;
        baseX: number;
        baseY: number;
        driftX: number;
        driftY: number;
        floatSpeed: number;
        phase: number;
        twinkleSpeed: number;
        twinklePhase: number;
        opacityBase: number;
        opacityAmp: number;
      };

      const backgroundStarPool: BackgroundStar[] = [];
      const starPointer = {
        x: 0,
        y: 0,
        targetStrength: 0,
        strength: 0,
      };

      const buildBackgroundStars = () => {
        backgroundStars.innerHTML = "";
        backgroundStarPool.length = 0;

        const rect = backgroundStars.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (width <= 0 || height <= 0) {
          return;
        }

        const centerX = width / 2;
        const centerY = height * 0.62;
        const starCount = isMobile ? 140 : 260;

        for (let index = 0; index < starCount; index += 1) {
          const star = document.createElement("div");
          const x = Math.random() * width;
          const y = Math.random() * height;
          const deltaX = x - centerX;
          const deltaY = y - centerY;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          const drift = 10 + Math.random() * 28;
          const offsetX = (deltaX / distance) * drift;
          const offsetY = (deltaY / distance) * drift;
          const size = Math.random() < 0.65 ? 1.7 : 2.5;

          star.style.position = "absolute";
          star.style.left = "0";
          star.style.top = "0";
          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          star.style.borderRadius = "999px";
          star.style.background = "rgba(255,255,255,0.88)";
          star.style.opacity = "0";
          star.style.boxShadow = "0 0 8px rgba(255,255,255,0.4)";
          star.style.transform = `translate(${x}px, ${y}px)`;

          backgroundStars.appendChild(star);

          backgroundStarPool.push({
            element: star,
            baseX: x,
            baseY: y,
            driftX: offsetX,
            driftY: offsetY,
            floatSpeed: 0.35 + Math.random() * 0.55,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: 1.2 + Math.random() * 2,
            twinklePhase: Math.random() * Math.PI * 2,
            opacityBase: 0.2 + Math.random() * 0.22,
            opacityAmp: 0.07 + Math.random() * 0.11,
          });
        }
      };

      buildBackgroundStars();

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

        shell.rotation.y += 0.0012;
        core.rotation.y -= 0.0018;

        const pulseTime = Date.now() * 0.002;
        const pulse = 1 + Math.sin(pulseTime) * 0.04;
        core.scale.set(pulse, pulse, pulse);

        pointerStrength += (pointerTargetStrength - pointerStrength) * 0.12;
        starPointer.strength += (starPointer.targetStrength - starPointer.strength) * 0.09;

        raycaster.setFromCamera(pointerNdc, camera);
        const hasIntersection =
          pointerInside && raycaster.ray.intersectSphere(interactionSphere, intersectionPoint) !== null;

        if (hasIntersection) {
          shellCursorLocal.copy(intersectionPoint);
          coreCursorLocal.copy(intersectionPoint);
          shell.worldToLocal(shellCursorLocal);
          core.worldToLocal(coreCursorLocal);
        }

        const shellPositionAttribute = shellGeometry.getAttribute("position") as THREE.BufferAttribute;
        const corePositionAttribute = coreGeometry.getAttribute("position") as THREE.BufferAttribute;
        const shellPositionArray = shellPositionAttribute.array as Float32Array;
        const corePositionArray = corePositionAttribute.array as Float32Array;

        displaceParticles(
          shellPositionArray,
          shellBasePositions,
          shellCursorLocal,
          hasIntersection,
          pointerStrength,
          1.42,
          0.55,
          0.2,
          0.17,
        );
        displaceParticles(
          corePositionArray,
          coreBasePositions,
          coreCursorLocal,
          hasIntersection,
          pointerStrength,
          1.05,
          0.4,
          0.12,
          0.2,
        );

        shellPositionAttribute.needsUpdate = true;
        corePositionAttribute.needsUpdate = true;

        const starTime = performance.now() * 0.001;
        const repulsionRadius = isMobile ? 190 : 280;
        const repulsionRadiusSquared = repulsionRadius * repulsionRadius;
        const maxRepel = isMobile ? 10 : 14;
        const waveAmplitude = isMobile ? 5 : 7;
        const waveFrequency = 0.055;
        const waveSpeed = 4.2;

        for (let index = 0; index < backgroundStarPool.length; index += 1) {
          const star = backgroundStarPool[index];
          const floatX = Math.sin(starTime * star.floatSpeed + star.phase) * star.driftX;
          const floatY = Math.cos(starTime * (star.floatSpeed * 0.88) + star.phase) * star.driftY;

          let finalX = star.baseX + floatX;
          let finalY = star.baseY + floatY;

          const twinkle =
            star.opacityBase + Math.sin(starTime * star.twinkleSpeed + star.twinklePhase) * star.opacityAmp;

          star.element.style.transform = `translate(${finalX}px, ${finalY}px)`;
          star.element.style.opacity = String(clamp(twinkle, 0.16, 0.86));
        }

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
        introTl.to(descriptionEl, { duration: 1, opacity: 1, y: 0, ease: "power3.out" }, "-=0.7");
        introTl.to(
          ctaEl,
          { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)" },
          "-=0.4",
        );

        introTl.from(sphereTarget, { duration: 2, y: 100, opacity: 0, ease: "power2.out" }, 0.2);
      } else {
        gsap.set([titleEl, descriptionEl, ctaEl], { opacity: 1, y: 0, scale: 1 });
      }

      const handlePointerMove = (event: PointerEvent) => {
        updatePointerFromEvent(event);

        const rect = rootEl.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

        starPointer.x = x;
        starPointer.y = y;
        starPointer.targetStrength = inside ? 0.85 : 0;
      };

      const clearAllPointerInfluence = () => {
        clearPointerInfluence();
        starPointer.targetStrength = 0;
      };

      const handleResize = () => {
        fitRenderer();
        buildBackgroundStars();
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

        shellGeometry.dispose();
        coreGeometry.dispose();
        shellMaterial.dispose();
        coreMaterial.dispose();
        renderer.dispose();

        if (sphereTarget.contains(renderer.domElement)) {
          sphereTarget.removeChild(renderer.domElement);
        }
      };
    },
    { scope: rootRef, revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden" style={{ background: 'var(--polarist-black, #010101)' }}>
      <div ref={backgroundStarsRef} className="pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        <div className="pointer-events-none mx-auto w-full px-6">
          <div className="mx-auto flex w-full max-w-[980px] -translate-y-[14vh] flex-col items-center text-center md:-translate-y-[12vh]">
          <h1
            ref={titleRef}
            className="mx-auto max-w-full translate-y-6 text-center opacity-0"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.8rem,5.2vw,3.5rem)', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.05, color: 'var(--polarist-white, #F6F6F6)' }}
          >
            <div className="block">
              {"La forma más simple de "}
              <div style={{ display: 'inline', color: 'var(--polarist-green, #CAFE5B)' }}>usar IA</div>
            </div>
            <div className="block">{"en tu vida"}</div>
          </h1>

          <p
            ref={descriptionRef}
            className="mx-auto mt-6 max-w-[760px] translate-y-6 opacity-0"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '16px', lineHeight: 1.55, color: '#FFFFFF' }}
          >
            <div className="block md:whitespace-nowrap">
              Polarist es una plataforma digital que conecta a las personas con herramientas e
            </div>
            <div className="block md:whitespace-nowrap">
              información clave para mejorar procesos a través de Inteligencia Artificial.
            </div>
          </p>

          <div ref={ctaRef} className="pointer-events-auto mx-auto mt-8 translate-y-4 scale-[0.92] opacity-0">
            <Link
              to={routes.login}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                padding: '12px 28px',
                background: 'var(--polarist-green, #CAFE5B)',
                color: 'var(--polarist-black, #010101)',
                borderRadius: 'var(--r-pill, 999px)',
                display: 'inline-block',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                border: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
            >
              Comenzar
            </Link>
          </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-20%] z-10 flex h-[90vh] w-full items-center justify-center">
        <div
          className="absolute h-[clamp(520px,52vw,700px)] w-[clamp(520px,52vw,700px)] rounded-full [filter:blur(60px)]"
          style={{
            background:
              "radial-gradient(circle, rgba(20,20,25,0.6) 0%, rgba(15,15,20,0.2) 50%, transparent 75%)",
          }}
        />

        <div
          ref={sphereTargetRef}
          className="relative h-[clamp(420px,74vmin,980px)] w-[clamp(420px,74vmin,980px)]"
        />
      </div>
    </div>
  );
};

export default InferenceGlobeHero;
