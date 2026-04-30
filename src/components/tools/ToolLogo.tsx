import { useEffect, useMemo, useState } from "react";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoSource = {
  src: string;
  imageClassName?: string;
};

const specialLogoByName: Record<string, LogoSource> = {
  ChatGPT: {
    src: "/logos/openai.png",
    imageClassName: "object-contain p-2.5",
  },
  Claude: {
    src: "/logos/claude.svg",
    imageClassName: "object-contain p-0 max-h-none max-w-none h-[96%] w-[96%]",
  },
  Gemini: {
    src: "/logos/gemini.svg",
    imageClassName: "object-contain p-0 max-h-none max-w-none h-[93%] w-[93%]",
  },
  "Stitch AI": {
    src: "/logos/stitch.png",
    imageClassName: "object-contain p-1.5",
  },
  Pomelli: {
    src: "/logos/pomelli.png",
    imageClassName: "object-contain p-1.5",
  },
  NotebookLM: { src: "/logos/notebooklm.svg" },
  "Nano Banana": { src: "/logos/gemini.svg" },
  Grok: {
    src: "/logos/grok.svg",
    imageClassName: "object-contain p-0 max-h-none max-w-none h-[93%] w-[93%]",
  },
  Apollo: { src: "/logos/apollo.svg" },
  Freepik: { src: "/logos/freepik.svg" },
  Genspark: { src: "/logos/genspark.svg" },
  Higgsfield: { src: "/logos/higgsfield.svg" },
  HeyGen: {
    src: "/logos/heygen.png",
    imageClassName: "object-contain p-1.5 max-h-[70%] max-w-[86%]",
  },
  Jasper: {
    src: "/logos/jasper.jpg",
    imageClassName: "object-contain p-0 mix-blend-multiply",
  },
  Loom: { src: "/logos/loom.svg" },
  Make: {
    src: "/logos/make.png",
    imageClassName: "object-contain p-0 max-h-none max-w-none h-[108%] w-[108%]",
  },
  Manychat: {
    src: "/logos/manychat.png",
    imageClassName: "object-contain p-1.5 brightness-0",
  },
  "Opus Clip": {
    src: "/logos/opusclip.png",
    imageClassName: "object-contain p-1.5 brightness-0",
  },
  Retell: {
    src: "/logos/retell.png",
    imageClassName: "object-contain p-0 mix-blend-multiply",
  },
  Sora: { src: "/logos/sora.svg" },
  Wispr: { src: "/logos/wispr.png", imageClassName: "object-cover p-0" },
  "Notion AI": { src: "/logos/notion.png" },
};

type ToolLogoProps = {
  name: string;
  logoFilename?: string | null;
  className?: string;
  imageClassName?: string;
};

export function ToolLogo({ name, logoFilename, className, imageClassName }: ToolLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const logoSources = useMemo(() => {
    const sources: LogoSource[] = [];

    if (logoFilename) {
      sources.push({
        src: `/logos/${logoFilename}`,
        imageClassName: "object-contain p-1.5",
      });
    }

    const specialLogo = specialLogoByName[name];

    if (specialLogo) {
      sources.push(specialLogo);
    }

    // Generic fallbacks for local assets in different formats
    const genericName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    sources.push({
      src: `/logos/${genericName}.png`,
      imageClassName: "object-contain p-1.5",
    });
    
    sources.push({
      src: `/logos/${genericName}.svg`,
      imageClassName: "object-contain p-1.5",
    });

    sources.push({
      src: `/logos/${genericName}.jpg`,
      imageClassName: "object-contain p-1.5",
    });

    return sources.filter(
      (source, index, allSources) =>
        allSources.findIndex((candidate) => candidate.src === source.src) === index,
    );
  }, [name, logoFilename]);

  useEffect(() => {
    setSourceIndex(0);
  }, [logoSources]);

  const activeSource = logoSources[sourceIndex];

  if (!activeSource) {
    return (
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted/40 text-muted-foreground",
          className,
        )}
      >
        <Wrench className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-background",
        className,
      )}
    >
      <img
        src={activeSource.src}
        alt={`Logo de ${name}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cn(
          "max-h-[78%] max-w-[78%] rounded-xl object-contain p-1",
          activeSource.imageClassName,
          imageClassName,
        )}
        onError={() => setSourceIndex((current) => current + 1)}
      />
    </div>
  );
}
