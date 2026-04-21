import { motion } from "framer-motion";

type Ellipse = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation?: number;
};

type Dot = {
  x: number;
  y: number;
  key: string;
};

type ActiveNodeTarget = {
  id: string;
  x: number;
  y: number;
};

type ActiveNode = Dot & {
  id: string;
  delay: string;
};

const GRID_STEP = 12;
const DOT_RADIUS = 2;

const landMasses: Ellipse[] = [
  { cx: 185, cy: 175, rx: 120, ry: 82, rotation: -12 },
  { cx: 285, cy: 150, rx: 72, ry: 56, rotation: 10 },
  { cx: 255, cy: 248, rx: 58, ry: 46, rotation: 22 },
  { cx: 310, cy: 352, rx: 64, ry: 96, rotation: -10 },
  { cx: 332, cy: 466, rx: 40, ry: 66, rotation: -14 },
  { cx: 338, cy: 86, rx: 52, ry: 32, rotation: -10 },
  { cx: 602, cy: 166, rx: 68, ry: 40, rotation: 8 },
  { cx: 650, cy: 302, rx: 78, ry: 126, rotation: -8 },
  { cx: 735, cy: 244, rx: 58, ry: 44, rotation: 4 },
  { cx: 822, cy: 192, rx: 188, ry: 98, rotation: 4 },
  { cx: 985, cy: 184, rx: 92, ry: 62, rotation: 10 },
  { cx: 876, cy: 278, rx: 122, ry: 56, rotation: 12 },
  { cx: 1035, cy: 232, rx: 18, ry: 28, rotation: 8 },
  { cx: 985, cy: 420, rx: 84, ry: 54, rotation: -2 },
  { cx: 1085, cy: 472, rx: 14, ry: 24, rotation: 18 },
];

const waterCutouts: Ellipse[] = [
  { cx: 246, cy: 120, rx: 40, ry: 22, rotation: -12 },
  { cx: 244, cy: 290, rx: 28, ry: 22, rotation: 18 },
  { cx: 710, cy: 156, rx: 44, ry: 18, rotation: 4 },
  { cx: 790, cy: 310, rx: 72, ry: 20, rotation: 10 },
  { cx: 940, cy: 116, rx: 38, ry: 18, rotation: 4 },
];

const activeNodeTargets: ActiveNodeTarget[] = [
  { id: "west-coast", x: 142, y: 190 },
  { id: "east-coast", x: 288, y: 194 },
  { id: "south-america", x: 318, y: 374 },
  { id: "western-europe", x: 585, y: 170 },
  { id: "west-africa", x: 622, y: 266 },
  { id: "india", x: 804, y: 246 },
  { id: "singapore", x: 886, y: 306 },
  { id: "japan", x: 1032, y: 214 },
  { id: "sydney", x: 1000, y: 420 },
];

const connectionPairs: Array<[string, string]> = [
  ["east-coast", "western-europe"],
  ["western-europe", "india"],
  ["west-africa", "singapore"],
  ["india", "japan"],
  ["singapore", "sydney"],
];

const rotatePoint = (x: number, y: number, cx: number, cy: number, angle: number) => {
  const radians = (angle * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;

  return {
    x: dx * Math.cos(radians) + dy * Math.sin(radians),
    y: -dx * Math.sin(radians) + dy * Math.cos(radians),
  };
};

const isInsideEllipse = (x: number, y: number, ellipse: Ellipse) => {
  const rotation = ellipse.rotation ?? 0;
  const rotated = rotatePoint(x, y, ellipse.cx, ellipse.cy, rotation);

  return (rotated.x * rotated.x) / (ellipse.rx * ellipse.rx) + (rotated.y * rotated.y) / (ellipse.ry * ellipse.ry) <= 1;
};

const isLandPoint = (x: number, y: number) => {
  const insideLandMass = landMasses.some((ellipse) => isInsideEllipse(x, y, ellipse));
  const insideWaterCutout = waterCutouts.some((ellipse) => isInsideEllipse(x, y, ellipse));

  return insideLandMass && !insideWaterCutout;
};

const dots: Dot[] = [];

for (let y = 36; y <= 540; y += GRID_STEP) {
  for (let x = 36; x <= 1164; x += GRID_STEP) {
    if (isLandPoint(x, y)) {
      dots.push({ x, y, key: `${x}-${y}` });
    }
  }
}

const findNearestDot = (target: ActiveNodeTarget) =>
  dots.reduce((closest, dot) => {
    const currentDistance = (dot.x - target.x) ** 2 + (dot.y - target.y) ** 2;
    const bestDistance = (closest.x - target.x) ** 2 + (closest.y - target.y) ** 2;
    return currentDistance < bestDistance ? dot : closest;
  }, dots[0]);

const getPulseDelay = (node: Dot, index: number) =>
  `${((node.x * 0.013 + node.y * 0.021 + index * 0.41) % 2.6).toFixed(2)}s`;

const activeNodes: ActiveNode[] = activeNodeTargets.map((target, index) => {
  const dot = findNearestDot(target);
  return {
    ...dot,
    id: target.id,
    delay: getPulseDelay(dot, index),
  };
});

const activeNodeMap = new Map(activeNodes.map((node) => [node.id, node]));

const connections = connectionPairs.map(([from, to]) => {
  const start = activeNodeMap.get(from);
  const end = activeNodeMap.get(to);

  if (!start || !end) {
    throw new Error(`Missing active node for connection ${from} -> ${to}`);
  }

  return {
    key: `${from}-${to}`,
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
  };
});

const activeNodeKeys = new Set(activeNodes.map((node) => node.key));

const WorldMapSVG = () => {
  return (
    <div className="w-full max-w-7xl px-6" aria-hidden="true">
      <style>
        {`
          @keyframes world-map-svg-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }

          .world-map-svg__active-node {
            animation: world-map-svg-pulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <svg viewBox="0 0 1200 600" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {dots.map((dot) => {
            if (activeNodeKeys.has(dot.key)) {
              return null;
            }

            return (
              <circle
                key={dot.key}
                cx={dot.x}
                cy={dot.y}
                r={DOT_RADIUS}
                fill="hsl(var(--muted-foreground))"
                opacity="0.3"
              />
            );
          })}

          {connections.map((connection) => (
            <line
              key={connection.key}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke="#CCFF00"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          ))}

          {activeNodes.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={DOT_RADIUS}
              fill="#CCFF00"
              opacity="0.8"
              className="world-map-svg__active-node"
              style={{ animationDelay: node.delay }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};

export default WorldMapSVG;
