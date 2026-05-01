import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { MaskedSlideReveal } from "@/components/ui/masked-slide-reveal";
import { ShinyButton } from "@/components/ui/shiny-button";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const InferenceGlobeHero = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sphereTargetRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' ? window.matchMedia("(max-width: 768px)").matches : false;

  useGSAP(
    () => {
      const sphereTarget = sphereTargetRef.current;
      const titleEl = titleRef.current;
      const ctaEl = ctaRef.current;

      if (!sphereTarget || !titleEl || !ctaEl) {
        return;
      }

      const rootEl = rootRef.current;

      if (!rootEl) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

        gsap.fromTo(wovenPoints.position, { y: -2 }, { y: 0, duration: 2, ease: "power2.out" });
        gsap.fromTo(wovenMaterial, { opacity: 0 }, { opacity: 0.92, duration: 2, ease: "power2.out" });
      } else {
        gsap.set([titleEl, ctaEl], { opacity: 1, y: 0, scale: 1 });
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
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden" style={{ background: 'var(--polarist-black, #010101)' }}>
      

      <div className={cn(
        "relative z-20 flex h-full w-full flex-col justify-end pb-[23vh] md:pb-[28vh] px-8 md:px-16 lg:px-24",
        isMobile ? "items-center" : "items-start"
      )}>
        <div className="pointer-events-none w-full max-w-4xl">
          <h1
            ref={titleRef}
            className="translate-y-6 opacity-0"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem,7vw,5.5rem)', fontWeight: 700, letterSpacing: '-2.5px', lineHeight: 0.88, color: 'var(--polarist-white, #F6F6F6)' }}
          >
            <div className={cn("block", isMobile ? "text-center" : "text-left")}>
              <MaskedSlideReveal text="Tu camino más" delay={0.6} />
              <br />
              <div style={{ display: 'inline' }}>
                <MaskedSlideReveal text="fácil" delay={0.6 + 2 * 0.08} />
              </div>
              <div style={{ display: 'inline', color: 'var(--polarist-green, #CAFE5B)' }}>
                <MaskedSlideReveal text="hacia la IA." delay={0.6 + 4 * 0.08} />
              </div>
            </div>
          </h1>

          <div ref={ctaRef} className={cn("pointer-events-auto mt-12 translate-y-4 scale-[0.92] opacity-0 flex", isMobile ? "justify-center" : "justify-start")}>
            <ShinyButton
              asChild
              className="inline-flex px-10 py-4 text-[16px] font-semibold tracking-[0.5px] no-underline"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Link to={routes.login}>Comenzar</Link>
            </ShinyButton>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex w-full h-full items-center justify-center overflow-hidden">
        <div
          ref={sphereTargetRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: isMobile ? 'translateY(-22%)' : 'translateX(21%) scale(1.1)' }}
        />
      </div>
    </div>
  );
};

export default InferenceGlobeHero;
