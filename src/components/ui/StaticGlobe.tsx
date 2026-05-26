import { useEffect, useRef } from "react";
import * as THREE from "three";

interface StaticGlobeProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const StaticGlobe = ({ width = 340, height = 340, className }: StaticGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = 18000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + (Math.random() - 0.5) * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.2) {
        color.setHex(0xCAFE5B);
      } else if (rand < 0.8) {
        color.setHex(0xFFFFFF);
      } else {
        color.setHex(0xAAAAAA);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      context.arc(16, 16, 16, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.011,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      map: texture,
      alphaTest: 0.1,
    });

    const wovenPoints = new THREE.Points(geometry, material);
    scene.add(wovenPoints);

    const fitRenderer = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (w === 0 || h === 0) {
        return;
      }

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    fitRenderer();
    window.addEventListener("resize", fitRenderer);

    const clock = new THREE.Clock();

    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      wovenPoints.rotation.y = elapsedTime * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", fitRenderer);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width, height }} />;
};
