import { useEffect, useMemo, useState } from "react";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoSource = {
  src: string;
  imageClassName?: string;
};

const specialLogoByName: Record<string, LogoSource> = {
  ChatGPT: {
    src: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    imageClassName: "object-contain p-2.5",
  },
  Claude: { src: "/logos/claude.svg" },
  Gemini: { src: "/logos/gemini.svg" },
  "Stitch AI": {
    src: "https://logo.clearbit.com/stitch.withgoogle.com?size=96",
    imageClassName: "object-contain p-1.5",
  },
  Pomelli: {
    src: "https://logo.clearbit.com/stitch.withgoogle.com?size=96",
    imageClassName: "object-contain p-1.5",
  },
  NotebookLM: { src: "/logos/notebooklm.svg" },
  "Nano Banana": { src: "/logos/gemini.svg" },
  Grok: { src: "/logos/grok.svg" },
  Apollo: { src: "/logos/apollo.svg" },
  Freepik: { src: "/logos/freepik1.svg" },
  Genspark: { src: "/logos/genspark.svg" },
  Higgsfield: { src: "/logos/higgsfield.svg" },
  Loom: { src: "/logos/loom.svg" },
  Sora: { src: "/logos/sora.svg" },
  Wispr: { src: "/logos/wispr.png", imageClassName: "object-cover p-0" },
};

type ToolLogoProps = {
  name: string;
  domain: string;
  logoFilename?: string | null;
  className?: string;
  imageClassName?: string;
};

export function ToolLogo({ name, domain, logoFilename, className, imageClassName }: ToolLogoProps) {
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

    sources.push({
      src: `https://logo.clearbit.com/${domain}?size=96`,
      imageClassName: "object-contain p-1.5",
    });

    sources.push({
      src: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      imageClassName: "object-contain p-2.5",
    });

    return sources.filter(
      (source, index, allSources) =>
        allSources.findIndex((candidate) => candidate.src === source.src) === index,
    );
  }, [domain, name, logoFilename]);

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
          "h-full w-full rounded-xl object-contain p-1.5",
          activeSource.imageClassName,
          imageClassName,
        )}
        onError={() => setSourceIndex((current) => current + 1)}
      />
    </div>
  );
}
