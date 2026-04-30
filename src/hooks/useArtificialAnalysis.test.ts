import { describe, expect, it } from "vitest";

import { getModelVisual } from "@/lib/modelIcons";

import {
  buildRadarMetricCards,
  RADAR_MOCK_MODELS,
  type ArtificialAnalysisModel,
} from "./useArtificialAnalysis";

const sampleModels: ArtificialAnalysisModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    slug: "gpt-4o",
    model_creator: {
      name: "OpenAI",
      slug: "openai",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 57,
    },
    pricing: {
      price_1m_blended_3_to_1: 5.6,
    },
    median_output_tokens_per_second: 74,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    slug: "claude-3-5-sonnet",
    model_creator: {
      name: "Anthropic",
      slug: "anthropic",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 49,
    },
    pricing: {
      price_1m_blended_3_to_1: 6,
    },
    median_output_tokens_per_second: 61,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    slug: "deepseek-v3",
    model_creator: {
      name: "DeepSeek",
      slug: "deepseek",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 44,
    },
    pricing: {
      price_1m_blended_3_to_1: 0.3,
    },
    median_output_tokens_per_second: 80,
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    slug: "gemini-2.5-flash",
    model_creator: {
      name: "Google",
      slug: "google",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 42,
    },
    pricing: {
      price_1m_blended_3_to_1: 1.1,
    },
    median_output_tokens_per_second: 180,
  },
];

describe("buildRadarMetricCards", () => {
  it("sorts each metric in the expected direction and limits the result set", () => {
    const cards = buildRadarMetricCards(sampleModels, 2);
    const intelligenceCard = cards.find((card) => card.key === "intelligence");
    const speedCard = cards.find((card) => card.key === "speed");
    const priceCard = cards.find((card) => card.key === "price");

    expect(cards).toHaveLength(3);
    expect(intelligenceCard?.points).toHaveLength(2);
    expect(speedCard?.points).toHaveLength(2);
    expect(priceCard?.points).toHaveLength(2);

    expect(intelligenceCard?.points[0]?.label).toBe("GPT-4o");
    expect(speedCard?.points[0]?.label).toBe("Gemini 2.5 Flash");
    expect(priceCard?.points[0]?.label).toBe("DeepSeek V3");
    expect(priceCard?.points[0]?.displayValue).toBe("0.30");
  });

  it("builds render-safe cards from the deterministic development mock", () => {
    const cards = buildRadarMetricCards(RADAR_MOCK_MODELS);

    expect(cards.map((card) => card.key)).toEqual(["intelligence", "speed", "price"]);

    for (const card of cards) {
      expect(card.points).toHaveLength(10);

      for (const point of card.points) {
        expect(point.label).toBeTruthy();
        expect(point.visual).toBeDefined();
        expect(point.visual.accentFrom).toBeTruthy();
        expect(point.visual.accentTo).toBeTruthy();
        expect(point.visual.glow).toBeTruthy();
      }
    }
  });
});

describe("getModelVisual", () => {
  it("maps known model slugs to local provider logos", () => {
    expect(getModelVisual("gpt-4o", "openai").iconSrc).toBe("/logos/ai/openai.webp");
    expect(getModelVisual("claude-3-5-sonnet", "anthropic").iconSrc).toBe(
      "/logos/ai/anthropic.webp",
    );
    expect(getModelVisual("gemini-2.5-flash", "google").iconSrc).toBe("/logos/ai/google.webp");
  });

  it("falls back gracefully for providers without a bundled logo", () => {
    const visual = getModelVisual("glm-5", "zhipu");

    expect(visual.iconSrc).toBeNull();
    expect(visual.fallbackLabel).toBe("GL");
  });
});
