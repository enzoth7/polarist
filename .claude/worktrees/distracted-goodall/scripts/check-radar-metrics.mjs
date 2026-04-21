import assert from "node:assert/strict";

import { buildRadarMetricCards, RADAR_MOCK_MODELS } from "../src/lib/artificialAnalysisMetrics.ts";

const cards = buildRadarMetricCards(RADAR_MOCK_MODELS);
const expectedKeys = ["intelligence", "speed", "price"];

assert.equal(cards.length, expectedKeys.length, "Radar should expose 3 normalized metric cards.");
assert.deepEqual(
  cards.map((card) => card.key),
  expectedKeys,
  "Radar metric keys are out of order or missing.",
);

for (const card of cards) {
  assert.equal(card.points.length, 10, `${card.key} should expose 10 points from the mock.`);

  for (const point of card.points) {
    assert.ok(point.label, `${card.key} contains a point without label.`);
    assert.ok(point.slug, `${card.key} contains a point without slug.`);
    assert.ok(Number.isFinite(point.value), `${card.key} contains a non numeric value.`);
    assert.ok(point.visual, `${card.key} contains a point without visual metadata.`);
    assert.ok(point.visual.accentFrom, `${card.key} contains a point without accentFrom.`);
    assert.ok(point.visual.accentTo, `${card.key} contains a point without accentTo.`);
    assert.ok(point.visual.glow, `${card.key} contains a point without glow.`);
  }
}

console.log(
  JSON.stringify(
    cards.map((card) => ({
      key: card.key,
      points: card.points.length,
      leader: card.points[0]?.label ?? null,
    })),
    null,
    2,
  ),
);
