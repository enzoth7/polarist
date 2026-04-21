export type ModelVisual = {
  iconSrc: string | null;
  fallbackLabel: string;
  accentFrom: string;
  accentTo: string;
  glow: string;
};

type ProviderVisual = Omit<ModelVisual, "fallbackLabel"> & {
  fallbackLabel?: string;
};

const PROVIDER_VISUALS = {
  openai: {
    iconSrc: "/logos/ai/openai.png",
    fallbackLabel: "O",
    accentFrom: "162 86% 47%",
    accentTo: "194 100% 62%",
    glow: "168 100% 63%",
  },
  anthropic: {
    iconSrc: "/logos/ai/anthropic.png",
    fallbackLabel: "A",
    accentFrom: "24 91% 63%",
    accentTo: "10 92% 61%",
    glow: "18 100% 71%",
  },
  google: {
    iconSrc: "/logos/ai/google.png",
    fallbackLabel: "G",
    accentFrom: "218 92% 64%",
    accentTo: "167 92% 57%",
    glow: "204 100% 68%",
  },
  deepseek: {
    iconSrc: "/logos/ai/deepseek.png",
    fallbackLabel: "D",
    accentFrom: "223 88% 60%",
    accentTo: "248 90% 68%",
    glow: "228 100% 72%",
  },
  xai: {
    iconSrc: "/logos/ai/xai.png",
    fallbackLabel: "X",
    accentFrom: "273 95% 71%",
    accentTo: "320 92% 69%",
    glow: "286 100% 77%",
  },
  meta: {
    iconSrc: "/logos/ai/meta.png",
    fallbackLabel: "M",
    accentFrom: "218 92% 58%",
    accentTo: "255 94% 70%",
    glow: "226 100% 69%",
  },
  nvidia: {
    iconSrc: "/logos/ai/nvidia.png",
    fallbackLabel: "N",
    accentFrom: "84 100% 54%",
    accentTo: "148 82% 46%",
    glow: "92 100% 66%",
  },
  mistral: {
    iconSrc: "/logos/ai/mistral.png",
    fallbackLabel: "M",
    accentFrom: "42 100% 57%",
    accentTo: "22 97% 63%",
    glow: "32 100% 71%",
  },
  alibaba: {
    iconSrc: "/logos/ai/alibaba.png",
    fallbackLabel: "Q",
    accentFrom: "18 100% 58%",
    accentTo: "38 100% 61%",
    glow: "24 100% 69%",
  },
  cohere: {
    iconSrc: "/logos/ai/cohere.png",
    fallbackLabel: "C",
    accentFrom: "247 87% 66%",
    accentTo: "191 100% 63%",
    glow: "226 100% 74%",
  },
  kimi: {
    iconSrc: "/logos/ai/kimi.png",
    fallbackLabel: "KI",
    accentFrom: "196 90% 58%",
    accentTo: "222 88% 66%",
    glow: "205 100% 70%",
  },
  muse: {
    iconSrc: "/logos/ai/muse.png",
    fallbackLabel: "MU",
    accentFrom: "280 82% 65%",
    accentTo: "308 88% 68%",
    glow: "290 100% 74%",
  },
  zhipu: {
    iconSrc: "/logos/ai/zhipu.png",
    fallbackLabel: "GL",
    accentFrom: "211 97% 63%",
    accentTo: "248 92% 68%",
    glow: "219 100% 74%",
  },
  default: {
    iconSrc: null,
    fallbackLabel: "AI",
    accentFrom: "185 81% 58%",
    accentTo: "317 87% 71%",
    glow: "191 100% 74%",
  },
} as const satisfies Record<string, ProviderVisual>;

type ProviderKey = keyof typeof PROVIDER_VISUALS;

const EXACT_MODEL_PROVIDER_MAP: Record<string, ProviderKey> = {
  "claude-3-5-sonnet": "anthropic",
  "claude-3-7-sonnet": "anthropic",
  "claude-sonnet-4": "anthropic",
  "claude-opus-4": "anthropic",
  "claude-opus-4-7": "anthropic",
  "claude-opus-4.7": "anthropic",
  "opus-4": "anthropic",
  "opus-4-7": "anthropic",
  "opus-4.7": "anthropic",
  "gemini-1.5-pro": "google",
  "gemini-2.5-pro": "google",
  "gemini-2.5-flash": "google",
  "gemini-2.0-flash": "google",
  "gpt-4o": "openai",
  "gpt-4.1": "openai",
  "gpt-5": "openai",
  "gpt-oss-120b": "openai",
  "grok-4": "xai",
  "grok-4.20": "xai",
};

const MODEL_PREFIX_PROVIDER_MAP: Array<[prefix: string, provider: ProviderKey]> = [
  ["gpt-oss-", "openai"],
  ["gpt-oss", "openai"],
  ["gpt-", "openai"],
  ["o1", "openai"],
  ["o3", "openai"],
  ["o4", "openai"],
  ["claude-", "anthropic"],
  ["opus-", "anthropic"],
  ["gemini-", "google"],
  ["gemma-", "google"],
  ["grok-", "xai"],
  ["deepseek-", "deepseek"],
  ["llama-", "meta"],
  ["nemotron-", "nvidia"],
  ["nvidia-", "nvidia"],
  ["mistral-", "mistral"],
  ["mixtral-", "mistral"],
  ["qwen-", "alibaba"],
  ["kimi-", "kimi"],
  ["kimi", "kimi"],
  ["muse-", "muse"],
  ["command-", "cohere"],
  ["aya-", "cohere"],
  ["glm-", "zhipu"],
];

const CREATOR_ALIASES: Record<string, ProviderKey> = {
  anthropic: "anthropic",
  cohere: "cohere",
  deepseek: "deepseek",
  google: "google",
  "google-deepmind": "google",
  kimi: "kimi",
  "moonshot-ai": "kimi",
  meta: "meta",
  mistral: "mistral",
  muse: "muse",
  nvidia: "nvidia",
  openai: "openai",
  qwen: "alibaba",
  alibaba: "alibaba",
  xai: "xai",
  "x-ai": "xai",
  zhipu: "zhipu",
};

const normalizeSlug = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";

const resolveProviderKey = (modelSlug: string, creatorSlug?: string) => {
  const normalizedModelSlug = normalizeSlug(modelSlug);
  const normalizedCreatorSlug = normalizeSlug(creatorSlug);

  const exactProvider = EXACT_MODEL_PROVIDER_MAP[normalizedModelSlug];

  if (exactProvider) {
    return exactProvider;
  }

  const prefixProvider = MODEL_PREFIX_PROVIDER_MAP.find(([prefix]) => normalizedModelSlug.startsWith(prefix))?.[1];

  if (prefixProvider) {
    return prefixProvider;
  }

  return CREATOR_ALIASES[normalizedCreatorSlug] ?? "default";
};

const buildFallbackLabel = (modelSlug: string, creatorSlug?: string) => {
  const normalizedCreatorSlug = normalizeSlug(creatorSlug);

  if (normalizedCreatorSlug) {
    return normalizedCreatorSlug.slice(0, 2).toUpperCase();
  }

  const normalizedModelSlug = normalizeSlug(modelSlug);
  const [primaryToken] = normalizedModelSlug.split(/[-_]/);

  return (primaryToken || "ai").slice(0, 2).toUpperCase();
};

export function getModelVisual(modelSlug: string, creatorSlug?: string): ModelVisual {
  const providerKey = resolveProviderKey(modelSlug, creatorSlug);
  const providerVisual = PROVIDER_VISUALS[providerKey];

  return {
    ...providerVisual,
    fallbackLabel: providerVisual.fallbackLabel ?? buildFallbackLabel(modelSlug, creatorSlug),
  };
}
