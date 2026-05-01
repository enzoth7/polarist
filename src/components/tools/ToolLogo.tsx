import { useEffect, useMemo, useState } from "react";
import { Wrench } from "lucide-react";

import { toModernAssetFilename } from "@/lib/assetPaths";
import { cn } from "@/lib/utils";

type LogoSource = {
  src: string;
  imageClassName?: string;
};

const specialLogoByName: Record<string, LogoSource> = {
  ChatGPT: {
    src: "/logos/openai.webp",
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
    src: "/logos/stitch.webp",
    imageClassName: "object-contain p-1.5",
  },
  Pomelli: {
    src: "/logos/pomelli.webp",
    imageClassName: "object-contain p-1.5",
  },
  NotebookLM: { src: "/logos/notebooklm.svg" },
  "Nano Banana": { src: "/logos/gemini.svg" },
  Grok: {
    src: "/logos/grok.svg",
    imageClassName: "object-contain p-0 max-h-none max-w-none h-[93%] w-[93%]",
  },
  Apollo: { src: "/logos/apollo.webp" },
  Freepik: { src: "/logos/freepik.svg" },
  Genspark: { src: "/logos/genspark.svg" },
  Higgsfield: { src: "/logos/higgsfield.svg" },
  HeyGen: {
    src: "/logos/heygen.webp",
    imageClassName: "object-contain p-1.5 max-h-[70%] max-w-[86%]",
  },
  Jasper: {
    src: "/logos/jasper.webp",
    imageClassName: "object-contain p-0 mix-blend-multiply",
  },
  Loom: { src: "/logos/loom.webp" },
  Make: {
    src: "/logos/make.webp",
    imageClassName: "object-contain p-0 max-h-none max-w-none h-[108%] w-[108%]",
  },
  Manychat: {
    src: "/logos/manychat.webp",
    imageClassName: "object-contain p-1.5 brightness-0",
  },
  "Opus Clip": {
    src: "/logos/opusclip.webp",
    imageClassName: "object-contain p-1.5 brightness-0",
  },
  Retell: {
    src: "/logos/retell.webp",
    imageClassName: "object-contain p-0 mix-blend-multiply",
  },
  Sora: { src: "/logos/sora.webp" },
  Wispr: { src: "/logos/wispr.webp", imageClassName: "object-cover p-0" },
  "Notion AI": { src: "/logos/notion.webp" },
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

    const specialLogo = specialLogoByName[name];

    if (specialLogo) {
      sources.push(specialLogo);
    }

    if (logoFilename) {
      const modernLogoFilename = toModernAssetFilename(logoFilename);

      if (modernLogoFilename) {
        sources.push({
          src: `/logos/${modernLogoFilename}`,
          imageClassName: "object-contain p-1.5",
        });
      }

      sources.push({
        src: `/logos/${logoFilename}`,
        imageClassName: "object-contain p-1.5",
      });
    }

    // Generic fallbacks for local assets in different formats
    const genericName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    sources.push({
      src: `/logos/${genericName}.webp`,
      imageClassName: "object-contain p-1.5",
    });

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
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground",
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
        "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background",
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
