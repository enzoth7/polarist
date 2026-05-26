export const routes = {
  landing: "/",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  contact: "/contact",
  login: "/login",
  resourcesCountdown: "/countdown",
  appTrends: "/trends",
  appTools: "/tools",
  appResources: "/resources",
  appCommunity: "/community",
  appProfile: "/library",
  appSettings: "/settings",
  agents: "/aiagents",
  services: "/services",
} as const;

export const getAppUserProfileRoute = (username: string) =>
  `/library/${encodeURIComponent(username)}`;

export const legacyAppRoutes = [
  { from: "/profile", to: "/library" },
  { from: "/app", to: "/library" },
  { from: "/app/profile", to: "/library" },
  { from: "/app/radar", to: "/trends" },
  { from: "/app/tools", to: "/tools" },
  { from: "/app/guides", to: "/resources" },
  { from: "/app/community", to: "/community" },
  { from: "/app/settings", to: "/settings" },
  { from: "/radar", to: "/trends" },
  { from: "/guides", to: "/resources" },
  { from: "/recursos-pronto", to: "/countdown" },
  { from: "/count-town", to: "/countdown" },
] as const;
