import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const InferenceGlobeHero = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sphereTargetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sphereTarget = sphereTargetRef.current;
      const titleEl = titleRef.current;
      const descriptionEl = descriptionRef.current;
      const ctaEl = ctaRef.current;

      if (!sphereTarget || !titleEl || !descriptionEl || !ctaEl) {
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

      const shellMaterial = new THREE.PointsMaterial({
        size: 0.012,
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
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

      const coreMaterial = new THREE.PointsMaterial({
        size: 0.018,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const core = new THREE.Points(coreGeometry, coreMaterial);
      scene.add(core);

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

      let frameId = 0;
      const animate = () => {
        frameId = window.requestAnimationFrame(animate);

        shell.rotation.y += 0.0012;
        core.rotation.y -= 0.0018;

        const time = Date.now() * 0.002;
        const pulse = 1 + Math.sin(time) * 0.04;
        core.scale.set(pulse, pulse, pulse);

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

      window.addEventListener("resize", fitRenderer);

      return () => {
        introTl.kill();
        window.removeEventListener("resize", fitRenderer);

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
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden bg-[#000000]">
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-start pt-[5vh]">
        <div className="pointer-events-none max-w-[900px] px-6 text-center">
          <h1
            ref={titleRef}
            className="mx-auto w-full translate-y-6 whitespace-nowrap text-center text-[clamp(1.8rem,5.2vw,3.5rem)] font-extrabold leading-[1.1] text-white opacity-0"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            La forma más simple de <span className="text-[#d4ff00] [text-shadow:0_0_30px_rgba(212,255,0,0.4)]">usar IA</span> en tu vida
          </h1>

          <p
            ref={descriptionRef}
            className="mx-auto mt-4 max-w-[760px] translate-y-6 text-[1.12rem] leading-[1.5] text-[#bbbbbb] opacity-0"
          >
            <span className="block md:whitespace-nowrap">
              Polarist es una plataforma digital que conecta a las personas con herramientas e
            </span>
            <span className="block md:whitespace-nowrap">
              información clave para mejorar procesos a través de Inteligencia Artificial.
            </span>
          </p>

          <div ref={ctaRef} className="pointer-events-auto mx-auto mt-8 translate-y-4 scale-[0.92] opacity-0">
            <Button
              asChild
              className="rounded-full border-0 bg-[#d4ff00] px-[38px] py-[14px] text-[0.95rem] font-bold text-black shadow-none transition-all duration-300 hover:scale-105 hover:bg-[#deff43] hover:shadow-[0_0_25px_rgba(212,255,0,0.5)]"
            >
              <Link to={routes.login}>Comenzar</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-20%] flex h-[90vh] w-full items-center justify-center">
        <div
          className="absolute h-[clamp(520px,52vw,700px)] w-[clamp(520px,52vw,700px)] rounded-full [filter:blur(60px)]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,255,0,0.12) 0%, rgba(212,255,0,0.04) 45%, transparent 70%)",
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
