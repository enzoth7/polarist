import { X, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import React from "react";

import { type ResourceItem } from "@/hooks/useResources";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";

export const FALLBACK_RESOURCE_IMAGE =
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80";

const SANS = "var(--font-sequel, sans-serif)";

function parseMarkdownSections(content: string): { heading: string; body: string }[] {
  const h2Parts = content
    .split(/\n(?=## )/)
    .filter((part) => part.startsWith("## "))
    .map((part) => {
      const lines = part.split("\n");
      return { heading: lines[0].slice(3).trim(), body: lines.slice(1).join("\n").trim() };
    });

  if (h2Parts.length > 1) {
    return h2Parts;
  }

  const wrapperBody = h2Parts[0]?.body ?? content;
  return wrapperBody
    .split(/\n(?=### )/)
    .filter((part) => part.trimStart().startsWith("### "))
    .map((part) => {
      const lines = part.split("\n");
      const heading = lines[0].replace(/^###\s+(\d+\.?\s*)?/, "").trim();
      return { heading, body: lines.slice(1).join("\n").trim() };
    });
}

function stripOuterH2(content: string): string {
  const lines = content.split("\n");
  if (!lines[0]?.startsWith("## ")) {
    return content;
  }

  let start = 1;
  while (start < lines.length && !lines[start]?.trim()) {
    start += 1;
  }

  return lines.slice(start).join("\n").trim();
}

const markdownComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h3
      className="mt-10 text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#F6F6F6] first:mt-0 md:text-[1.5rem]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </h3>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h4
      className="mt-8 text-[1.05rem] font-bold leading-[1.25] tracking-[-0.015em] text-[#F6F6F6] md:text-[1.15rem]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p
      className="mt-3 text-[14.5px] leading-[1.75] text-[#F6F6F6]/72 md:text-[15px]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-3 flex flex-col gap-2.5 pl-1">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li
      className="relative pl-5 text-[14.5px] leading-[1.6] text-[#F6F6F6]/72 before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-[#CAFE5B] md:text-[15px]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => {
    const text = Array.isArray(children)
      ? children.map((child) => (typeof child === "string" ? child : "")).join("")
      : typeof children === "string"
        ? children
        : "";
    const isLabel = text.trimEnd().endsWith(":");

    return (
      <strong className="font-bold" style={{ color: isLabel ? "#CAFE5B" : "#F6F6F6" }}>
        {children}
      </strong>
    );
  },
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="not-italic text-[#F6F6F6]/55" style={{ fontFamily: SANS }}>
      {children}
    </em>
  ),
};

export function ResourceDetail({
  resource,
  onClose,
}: {
  resource: ResourceItem;
  onClose: () => void;
}) {
  const sections = resource.content ? parseMarkdownSections(resource.content) : [];
  const flatBody = resource.content ? stripOuterH2(resource.content) : null;

  return (
    <div className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#010101] text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={resource.image ?? FALLBACK_RESOURCE_IMAGE}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/40 to-transparent" />
        </div>

        <div className="px-7 pb-4 pt-6 md:px-10 md:pt-8">
          <h2
            className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            style={{ fontFamily: SANS }}
          >
            {resource.title}
          </h2>
          <p
            className="mt-5 text-[15px] leading-[1.7] text-[#F6F6F6]/70"
            style={{ fontFamily: SANS }}
          >
            {resource.description}
          </p>
        </div>

        {sections.length === 0 && flatBody ? (
          <div className="px-7 pb-10 pt-4 md:px-10">
            <ReactMarkdown components={markdownComponents}>{flatBody}</ReactMarkdown>
          </div>
        ) : null}

        {sections.length > 0 ? (
          <div className="px-5 pb-10 pt-3 md:px-8">
            <Accordion type="multiple" className="space-y-2">
              {sections.map((section, index) => (
                <AccordionItem
                  key={index}
                  value={`section-${index}`}
                  className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#010101] px-6 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left [&[data-state=open]>div]:rotate-45">
                      <span
                        className="text-[0.97rem] font-bold leading-tight tracking-[-0.02em] text-[#F6F6F6] md:text-[1.05rem]"
                        style={{ fontFamily: SANS }}
                      >
                        {section.heading}
                      </span>
                      <div className="flex shrink-0 items-center transition-transform duration-300">
                        <Plus className="h-[18px] w-[18px] text-[#F6F6F6]/70" strokeWidth={2} />
                      </div>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="pb-5">
                    <ReactMarkdown components={markdownComponents}>{section.body}</ReactMarkdown>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>
    </div>
  );
}
