import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

declare const gsap: any;
declare const THREE: any;

export interface LuminaSlide {
  title: string;
  description: string;
  media: string;
  link?: string;
}

export interface LuminaInteractiveListProps {
  slides: LuminaSlide[];
}

export function LuminaInteractiveList({ slides }: LuminaInteractiveListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ next: () => void, prev: () => void } | null>(null);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    // Add fonts if needed (Sequel and Arno are local)
    if (!slides || slides.length === 0) return;

    // --- DYNAMIC SCRIPT LOADING ---
    const loadScripts = async () => {
      const loadScript = (src: string, globalName: string) => new Promise<void>((res, rej) => {
        if ((window as any)[globalName]) { res(); return; }
        if (document.querySelector(`script[src="${src}"]`)) {
          const check = setInterval(() => {
            if ((window as any)[globalName]) { clearInterval(check); res(); }
          }, 50);
          setTimeout(() => { clearInterval(check); rej(new Error(`Timeout waiting for ${globalName}`)); }, 10000);
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { setTimeout(() => res(), 100); };
        s.onerror = () => rej(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });

      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE');
      } catch (e) {
        console.error('Failed to load base scripts:', e);
      }

      return initApplication();
    };

    const initApplication = async () => {
      // --- MAIN LOGIC ---
      const SLIDER_CONFIG: any = {
        settings: {
          transitionDuration: 2.5, autoSlideSpeed: 15000, currentEffect: "glass", currentEffectPreset: "Default",
          globalIntensity: 1.0, speedMultiplier: 1.0, distortionStrength: 1.0, colorEnhancement: 1.0,
          glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0,
          frostIntensity: 1.5, frostCrystalSize: 1.0, frostIceCoverage: 1.0, frostTemperature: 1.0, frostTexture: 1.0,
          rippleFrequency: 25.0, rippleAmplitude: 0.08, rippleWaveSpeed: 1.0, rippleRippleCount: 1.0, rippleDecay: 1.0,
          plasmaIntensity: 1.2, plasmaSpeed: 0.8, plasmaEnergyIntensity: 0.4, plasmaContrastBoost: 0.3, plasmaTurbulence: 1.0,
          timeshiftDistortion: 1.6, timeshiftBlur: 1.5, timeshiftFlow: 1.4, timeshiftChromatic: 1.5, timeshiftTurbulence: 1.4
        },
        effectPresets: {
          glass: { Subtle: { glassRefractionStrength: 0.6, glassChromaticAberration: 0.5, glassBubbleClarity: 1.3, glassEdgeGlow: 0.7, glassLiquidFlow: 0.8 }, Default: { glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0 }, Crystal: { glassRefractionStrength: 1.5, glassChromaticAberration: 1.8, glassBubbleClarity: 0.7, glassEdgeGlow: 1.4, glassLiquidFlow: 0.5 }, Liquid: { glassRefractionStrength: 0.8, glassChromaticAberration: 0.4, glassBubbleClarity: 1.2, glassEdgeGlow: 0.8, glassLiquidFlow: 1.8 } },
        }
      };

      // --- GLOBAL STATE ---
      let currentSlideIndex = 0;
      let isTransitioning = false;
      let shaderMaterial: any, renderer: any, scene: any, camera: any;
      let slideTextures: any[] = [];
      let texturesLoaded = false;
      let autoSlideTimer: any = null;
      let progressAnimation: any = null;
      let sliderEnabled = false;

      const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
      const PROGRESS_UPDATE_INTERVAL = 50;
      const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

      // --- SHADERS ---
      const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const fragmentShader = `
            uniform sampler2D uTexture1, uTexture2;
            uniform float uProgress;
            uniform vec2 uResolution, uTexture1Size, uTexture2Size;
            uniform int uEffectType;
            uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
            uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
            varying vec2 vUv;

            vec2 getCoverUV(vec2 uv, vec2 textureSize) {
                vec2 s = uResolution / textureSize;
                float scale = max(s.x, s.y);
                vec2 scaledSize = textureSize * scale;
                vec2 offset = (uResolution - scaledSize) * 0.5;
                return (uv * uResolution - offset) / scaledSize;
            }
            float noise(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            
            vec4 glassEffect(vec2 uv, float progress) {
                float time = progress * 5.0 * uSpeedMultiplier;
                vec2 uv1 = getCoverUV(uv, uTexture1Size); vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float maxR = length(uResolution) * 0.85; float br = progress * maxR;
                vec2 p = uv * uResolution; vec2 c = uResolution * 0.5;
                float d = length(p - c); float nd = d / max(br, 0.001);
                float param = smoothstep(br + 3.0, br - 3.0, d); // Inside circle
                vec4 img;
                if (param > 0.0) {
                     float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
                     vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
                     vec2 distUV = uv2 - dir * ro;
                     distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
                     float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
                     img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r, texture2D(uTexture2, distUV + dir * ca * 0.2).g, texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);
                     if (uGlassEdgeGlow > 0.0) {
                        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
                        img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
                     }
                } else { img = texture2D(uTexture2, uv2); }
                vec4 oldImg = texture2D(uTexture1, uv1);
                if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
                return mix(oldImg, img, param);
            }

            void main() {
                gl_FragColor = glassEffect(vUv, uProgress);
            }
        `;

      // --- CORE FUNCTIONS ---
      const getEffectIndex = (n: string) => 0; // Only glass effect for now

      const updateShaderUniforms = () => {
        if (!shaderMaterial) return;
        const s = SLIDER_CONFIG.settings, u = shaderMaterial.uniforms;
        for (const key in s) {
          const uName = 'u' + key.charAt(0).toUpperCase() + key.slice(1);
          if (u[uName]) u[uName].value = s[key];
        }
        u.uEffectType.value = getEffectIndex(s.currentEffect);
      };

      const splitTextLine = (words: string[]) => {
        return words.map(word => {
          const chars = word.split('').map(char =>
            `<span data-title-char style="display: inline-block; opacity: 0;">${char}</span>`
          ).join('');
          return `<span style="display: inline-block; white-space: nowrap;">${chars}</span>`;
        }).join('&nbsp;');
      };

      const splitText = (text: string) => {
        const words = text.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return '';
        if (words.length === 1) return splitTextLine(words);

        if (words.length <= 6) {
          if (words.length <= 3) {
            return `<span class="title-line">${splitTextLine(words)}</span>`;
          }
          const mid = Math.ceil(words.length / 2);
          return [
            `<span class="title-line">${splitTextLine(words.slice(0, mid))}</span>`,
            `<span class="title-line">${splitTextLine(words.slice(mid))}</span>`,
          ].join('');
        }

        if (words.length <= 11) {
          let bestSplit = 1;
          let bestScore = Number.POSITIVE_INFINITY;
          const targetFirstLineWeight = 0.5;
          const totalTextLength = words.join(' ').length;

          for (let i = 1; i < words.length; i += 1) {
            const firstLineLength = words.slice(0, i).join(' ').length;
            const score = Math.abs(firstLineLength / totalTextLength - targetFirstLineWeight);
            if (score < bestScore) {
              bestScore = score;
              bestSplit = i;
            }
          }

          return [
            `<span class="title-line">${splitTextLine(words.slice(0, bestSplit))}</span>`,
            `<span class="title-line">${splitTextLine(words.slice(bestSplit))}</span>`,
          ].join('');
        } else {
          let bestSplit1 = 1;
          let bestSplit2 = 2;
          let bestScore = Number.POSITIVE_INFINITY;
          const totalTextLength = words.join(' ').length;
          const targetWeight = 1 / 3;

          for (let i = 1; i < words.length - 1; i++) {
            const line1Length = words.slice(0, i).join(' ').length;
            const ratio1 = line1Length / totalTextLength;

            for (let j = i + 1; j < words.length; j++) {
              const line2Length = words.slice(i, j).join(' ').length;
              const line3Length = words.slice(j).join(' ').length;

              const ratio2 = line2Length / totalTextLength;
              const ratio3 = line3Length / totalTextLength;

              const score = Math.abs(ratio1 - targetWeight) +
                Math.abs(ratio2 - targetWeight) +
                Math.abs(ratio3 - targetWeight);

              if (score < bestScore) {
                bestScore = score;
                bestSplit1 = i;
                bestSplit2 = j;
              }
            }
          }

          return [
            `<span class="title-line">${splitTextLine(words.slice(0, bestSplit1))}</span>`,
            `<span class="title-line">${splitTextLine(words.slice(bestSplit1, bestSplit2))}</span>`,
            `<span class="title-line">${splitTextLine(words.slice(bestSplit2))}</span>`,
          ].join('');
        }
      };

      const getTitleChars = (titleEl: Element) => titleEl.querySelectorAll('[data-title-char]');

      const updateContent = (idx: number) => {
        const container = containerRef.current;
        if (!container) return;
        const titleEl = container.querySelector('#mainTitle');
        const descEl = container.querySelector('#mainDesc');
        const linkEl = container.querySelector('#mainLink') as HTMLAnchorElement;
        if (titleEl && descEl) {
          // Universal animate out (fade up)
          gsap.to(getTitleChars(titleEl), { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
          gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });
          if (linkEl) {
            gsap.to(linkEl, { opacity: 0, duration: 0.4, ease: "power2.in" });
          }

          setTimeout(() => {
            // Set new content
            titleEl.innerHTML = splitText(slides[idx].title);
            descEl.textContent = slides[idx].description;

            if (linkEl) {
              if (slides[idx].link) {
                linkEl.href = slides[idx].link;
                linkEl.style.display = 'inline-flex';
                gsap.set(linkEl, { opacity: 0 });
                gsap.to(linkEl, { opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
              } else {
                linkEl.style.display = 'none';
              }
            }

            // Reset state (general reset, specific animations might override)
            const titleChars = getTitleChars(titleEl);
            gsap.set(titleChars, { opacity: 0 });
            gsap.set(descEl, { y: 20, opacity: 0 });

            // Stagger Up (Original)
            gsap.set(titleChars, { y: 20 });
            gsap.to(titleChars, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
            gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
          }, 500);
        }
      };

      const navigateToSlide = (targetIndex: number) => {
        if (isTransitioning || targetIndex === currentSlideIndex) return; // BLOCKING LOGIC
        stopAutoSlideTimer();
        quickResetProgress(currentSlideIndex);

        const currentTexture = slideTextures[currentSlideIndex];
        const targetTexture = slideTextures[targetIndex];
        if (!currentTexture || !targetTexture) return;

        isTransitioning = true;
        shaderMaterial.uniforms.uTexture1.value = currentTexture;
        shaderMaterial.uniforms.uTexture2.value = targetTexture;
        shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

        updateContent(targetIndex);

        currentSlideIndex = targetIndex;
        updateCounter(currentSlideIndex);
        updateNavigationState(currentSlideIndex);

        gsap.fromTo(shaderMaterial.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: TRANSITION_DURATION(),
            ease: "power2.inOut",
            onComplete: () => {
              shaderMaterial.uniforms.uProgress.value = 0;
              shaderMaterial.uniforms.uTexture1.value = targetTexture;
              shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
              isTransitioning = false;
              safeStartTimer(100);
            }
          }
        );
      };

      const handleSlideChange = () => {
        if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
        navigateToSlide((currentSlideIndex + 1) % slides.length);
      };

      const createSlidesNavigation = () => {
        const container = containerRef.current;
        if (!container) return;
        const nav = container.querySelector("#slidesNav"); if (!nav) return;
        nav.innerHTML = "";
        slides.forEach((slide, i) => {
          const item = document.createElement("div");
          item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
          item.dataset.slideIndex = String(i);
          item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!isTransitioning && i !== currentSlideIndex) {
              stopAutoSlideTimer();
              quickResetProgress(currentSlideIndex);
              navigateToSlide(i);
            }
          });
          nav.appendChild(item);
        });
      };

      const updateNavigationState = (idx: number) => { const container = containerRef.current; if (container) container.querySelectorAll(".slide-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx)); };
      const updateSlideProgress = (idx: number, prog: number) => { const container = containerRef.current; const el = container?.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.width = `${prog}%`; el.style.opacity = '1'; } };
      const fadeSlideProgress = (idx: number) => { const container = containerRef.current; const el = container?.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.opacity = '0'; setTimeout(() => el.style.width = "0%", 300); } };
      const quickResetProgress = (idx: number) => { const container = containerRef.current; const el = container?.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.transition = "width 0.2s ease-out"; el.style.width = "0%"; setTimeout(() => el.style.transition = "width 0.1s ease, opacity 0.3s ease", 200); } };
      const updateCounter = (idx: number) => {
        const container = containerRef.current;
        if (!container) return;
        const sn = container.querySelector("#slideNumber"); if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
        const st = container.querySelector("#slideTotal"); if (st) st.textContent = String(slides.length).padStart(2, "0");
      };

      const startAutoSlideTimer = () => {
        if (!texturesLoaded || !sliderEnabled) return;
        stopAutoSlideTimer();
        let progress = 0;
        const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
        progressAnimation = setInterval(() => {
          if (!sliderEnabled) { stopAutoSlideTimer(); return; }
          progress += increment;
          updateSlideProgress(currentSlideIndex, progress);
          if (progress >= 100) {
            clearInterval(progressAnimation); progressAnimation = null;
            fadeSlideProgress(currentSlideIndex);
            if (!isTransitioning) handleSlideChange();
          }
        }, PROGRESS_UPDATE_INTERVAL);
      };
      const stopAutoSlideTimer = () => { if (progressAnimation) clearInterval(progressAnimation); if (autoSlideTimer) clearTimeout(autoSlideTimer); progressAnimation = null; autoSlideTimer = null; };
      const safeStartTimer = (delay = 0) => { stopAutoSlideTimer(); if (sliderEnabled && texturesLoaded) { if (delay > 0) autoSlideTimer = setTimeout(startAutoSlideTimer, delay); else startAutoSlideTimer(); } };

      const loadImageTexture = (src: string) => new Promise<any>((resolve, reject) => {
        const l = new THREE.TextureLoader();
        l.setCrossOrigin('anonymous');
        l.load(src, (t: any) => { t.minFilter = t.magFilter = THREE.LinearFilter; t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) }; resolve(t); }, undefined, reject);
      });

      const initRenderer = async () => {
        const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement; if (!canvas) return;
        scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
            uEffectType: { value: 0 },
            uGlobalIntensity: { value: 1.0 }, uSpeedMultiplier: { value: 1.0 }, uDistortionStrength: { value: 1.0 }, uColorEnhancement: { value: 1.0 },
            uGlassRefractionStrength: { value: 1.0 }, uGlassChromaticAberration: { value: 1.0 }, uGlassBubbleClarity: { value: 1.0 }, uGlassEdgeGlow: { value: 1.0 }, uGlassLiquidFlow: { value: 1.0 }
          },
          vertexShader, fragmentShader
        });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

        // Limit to valid media
        const validSlides = slides.filter(s => s.media);
        for (const s of validSlides) { try { slideTextures.push(await loadImageTexture(s.media)); } catch { console.warn("Failed texture"); } }

        if (slideTextures.length > 0) {
          // If only 1 texture, duplicate it to prevent crashes
          if (slideTextures.length === 1) slideTextures.push(slideTextures[0]);

          shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
          shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
          shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
          shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
          texturesLoaded = true; sliderEnabled = true;
          updateShaderUniforms(); // Apply config
          document.querySelector(".slider-wrapper")?.classList.add("loaded"); // Fade in immediately
          safeStartTimer(500);
        }

        let animationFrameId: number;
        const render = () => { animationFrameId = requestAnimationFrame(render); renderer.render(scene, camera); };
        render();

        // Assign animation frame ID to cleanup scope
        (containerRef as any)._animationFrameId = animationFrameId;
      };

      createSlidesNavigation(); updateCounter(0);

      // Init text content
      const initialContainer = containerRef.current;
      if (initialContainer) {
        const tEl = initialContainer.querySelector('#mainTitle');
        const dEl = initialContainer.querySelector('#mainDesc');
        const lEl = initialContainer.querySelector('#mainLink') as HTMLAnchorElement;
        if (tEl && dEl) {
          tEl.innerHTML = splitText(slides[0].title);
          dEl.textContent = slides[0].description;
          if (lEl) {
            if (slides[0].link) {
              lEl.href = slides[0].link;
              lEl.style.display = 'inline-flex';
              gsap.fromTo(lEl, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
            } else {
              lEl.style.display = 'none';
            }
          }
          // animate initial in
          gsap.fromTo(getTitleChars(tEl), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
          gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
        }
      }

      initRenderer();

      // Listeners
      const handleVisibilityChange = () => document.hidden ? stopAutoSlideTimer() : (!isTransitioning && safeStartTimer());
      const handleResize = () => { if (renderer) { renderer.setSize(window.innerWidth, window.innerHeight); shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight); } };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("resize", handleResize);

      // Exponer API de navegación
      apiRef.current = {
        next: () => {
          if (!isTransitioning) {
            navigateToSlide((currentSlideIndex + 1) % slides.length);
          }
        },
        prev: () => {
          if (!isTransitioning) {
            navigateToSlide((currentSlideIndex - 1 + slides.length) % slides.length);
          }
        }
      };

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame((containerRef as any)._animationFrameId);
        stopAutoSlideTimer();
        if (shaderMaterial) gsap.killTweensOf(shaderMaterial.uniforms.uProgress);
        const tEl = containerRef.current?.querySelector('#mainTitle');
        const dEl = containerRef.current?.querySelector('#mainDesc');
        if (tEl) gsap.killTweensOf(getTitleChars(tEl));
        if (dEl) gsap.killTweensOf(dEl);
        if (renderer) renderer.dispose();
        if (scene) scene.clear();
      };
    };

    let cleanupFn: any = null;

    loadScripts().then(fn => {
      cleanupFn = fn;
    });

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [slides]);

  return (
    <>
      <main className="slider-wrapper h-screen w-full relative overflow-hidden" ref={containerRef}>
        <canvas className="webgl-canvas absolute inset-0 z-0"></canvas>

        {/* Capa de oscurecimiento para legibilidad del texto */}
        <div className="absolute inset-0 z-[5] bg-black/50 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none"></div>




        <div className="slide-content absolute inset-0 flex flex-col items-start justify-start z-10 pointer-events-none px-8 md:px-16 lg:px-24 pt-40 md:pt-32 lg:pt-36 drop-shadow-2xl w-full max-w-7xl mx-auto">
          <h1
            className="slide-title text-[clamp(35px,6vw,44px)] md:text-7xl lg:text-8xl text-white mb-6 text-left leading-[1.15] tracking-[-0.03em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{
              fontFamily: '"Arno Pro", serif',
              fontWeight: 400,
              textWrap: 'wrap',
              maxWidth: '1000px',
              hyphens: 'none',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              whiteSpace: 'normal'
            }}
            id="mainTitle"
          >
          </h1>
          <p
            className="slide-description text-base md:text-lg lg:text-xl text-white max-w-2xl text-left leading-[1.6] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
            style={{
              fontFamily: 'var(--font-sequel, sans-serif)',
              fontWeight: 400,
              letterSpacing: '0.01em',
              opacity: 0.98
            }}
            id="mainDesc"
          >
          </p>
          <a
            id="mainLink"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white text-[#010101] px-8 py-3.5 text-xs md:text-sm font-semibold tracking-[0.02em] shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/90 hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(255,255,255,0.25)] active:scale-[0.98] pointer-events-auto"
            style={{
              fontFamily: 'var(--font-sequel, sans-serif)',
            }}
          >
            Ver más
          </a>
        </div>

        <button
          type="button"
          aria-label="Noticia anterior"
          onClick={() => apiRef.current?.prev()}
          className="absolute left-4 bottom-48 top-auto translate-y-0 z-20 flex h-14 w-14 items-center justify-center text-white transition-all duration-300 hover:scale-110 md:left-14 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:h-16 md:w-16"
        >
          <ChevronLeft className="h-[1.7rem] w-[1.7rem]" strokeWidth={2.3} />
        </button>

        <button
          type="button"
          aria-label="Siguiente noticia"
          onClick={() => apiRef.current?.next()}
          className="absolute right-4 bottom-48 top-auto translate-y-0 z-20 flex h-14 w-14 items-center justify-center text-white transition-all duration-300 hover:scale-110 md:right-14 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:h-16 md:w-16"
        >
          <ChevronRight className="h-[1.7rem] w-[1.7rem]" strokeWidth={2.3} />
        </button>
      </main>

      <style>{`
        .slide-nav-item { cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .slide-progress-line { width: 80px; height: 2px; background: rgba(255,255,255,0.2); overflow: hidden; }
        .slide-progress-fill { width: 0%; height: 100%; background: #CAFE5B; opacity: 0; }
        .slide-nav-title { font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1.5px; transition: color 0.3s; white-space: nowrap; }
        .slide-nav-item.active .slide-nav-title { color: #fff; }
        .title-line {
          display: block;
          white-space: normal;
          text-wrap: balance;
        }
        @media (min-width: 768px) {
          .title-line {
            white-space: nowrap;
          }
        }
      `}</style>
    </>
  );
}
