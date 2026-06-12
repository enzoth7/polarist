export const routes = {
  landing: "/",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  contact: "/contact",
  login: "/login",
  appTools: "/tools",
  appResources: "/resources",
  appCommunity: "/community",
  appProfile: "/library",
  appSettings: "/settings",
  agents: "/aiagents",
  services: "/services",
  appAsesorias: "/asesorias",
} as const;

export const getAppUserProfileRoute = (username: string) =>
  `/library/${encodeURIComponent(username)}`;

export const legacyAppRoutes = [
  { from: "/profile", to: "/library" },
  { from: "/app", to: "/library" },
  { from: "/app/profile", to: "/library" },
  { from: "/app/radar", to: "/tools" },
  { from: "/app/tools", to: "/tools" },
  { from: "/app/guides", to: "/resources" },
  { from: "/app/community", to: "/community" },
  { from: "/app/settings", to: "/settings" },
  { from: "/radar", to: "/tools" },
  { from: "/trends", to: "/tools" },
  { from: "/guides", to: "/resources" },
] as const;
