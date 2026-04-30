export const routes = {
  landing: "/",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  contact: "/contact",
  login: "/login",
  resourcesComingSoon: "/recursos-pronto",
  appTrends: "/trends",
  appTools: "/tools",
  appResources: "/resources",
  appCommunity: "/community",
  appProfile: "/profile",
  appSettings: "/settings",
} as const;

export const getAppUserProfileRoute = (username: string) =>
  `/library/${encodeURIComponent(username)}`;

export const legacyAppRoutes = [
  { from: "/app", to: "/profile" },
  { from: "/app/radar", to: "/trends" },
  { from: "/app/tools", to: "/tools" },
  { from: "/app/guides", to: "/resources" },
  { from: "/app/community", to: "/community" },
  { from: "/app/profile", to: "/profile" },
  { from: "/app/settings", to: "/settings" },
  { from: "/radar", to: "/trends" },
  { from: "/guides", to: "/resources" },
] as const;
