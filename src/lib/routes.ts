export const routes = {
  landing: "/",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  contact: "/contact",
  login: "/login",
  resourcesComingSoon: "/recursos-pronto",
  appRoot: "/app",
  appRadar: "/app/radar",
  appTools: "/app/tools",
  appGuides: "/app/guides",
  appCommunity: "/app/community",
  appProfile: "/app/profile",
  appSettings: "/app/settings",
} as const;

export const getAppUserProfileRoute = (username: string) =>
  `${routes.appProfile}/${encodeURIComponent(username)}`;

export const legacyAppRoutes = [
  { from: "/radar", to: routes.appRadar },
  { from: "/tools", to: routes.appTools },
  { from: "/guides", to: routes.appGuides },
  { from: "/community", to: routes.appCommunity },
  { from: "/profile", to: routes.appProfile },
] as const;
