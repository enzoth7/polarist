"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveFeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  description: string;
}

export function InteractiveFeatureCard({
  className,
  imageUrl,
  title,
  description,
  ...props
}: InteractiveFeatureCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y - height / 2) / (height / 2)) * -8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  return (
    <div className={cn("feature-card w-full h-[400px]", className)} {...props}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ ...style, transformStyle: "preserve-3d" }}
        className="relative w-full h-full rounded-[24px] bg-[#010101] shadow-2xl group cursor-pointer border border-white/10 overflow-visible"
      >
      {/* Background Container - clipped */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden" style={{ transform: "translateZ(0px)" }}>
         <img
           src={imageUrl}
           alt={title}
           className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 mix-blend-screen"
           style={{ transform: "scale(1.05)" }}
         />
         {/* Gradient Overlay to ensure text readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/60 to-transparent rounded-[24px]" />
      </div>

      {/* Main Content with 3D Pop Effect */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-8 pb-14 pt-8 pointer-events-none md:px-9 md:pb-16"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="flex flex-col gap-2">
          <h3 className="feature-title text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
            {title}
          </h3>
          <p className="feature-desc text-sm text-white/60 leading-relaxed" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
