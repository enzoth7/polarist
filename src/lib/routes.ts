export const routes = {
  landing: "/",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  contact: "/contact",
  login: "/login",
  appRoot: "/app",
  appRadar: "/app/radar",
  appShortcuts: "/app/shortcuts",
  appTools: "/app/tools",
  appToolsRanking: "/app/tools/ranking",
  appToolsTips: "/app/tools/trucos",
  appGuides: "/app/guides",
  appCommunity: "/app/community",
  appProfile: "/app/profile",
  appLibrary: "/app/library",
  appSettings: "/app/settings",
} as const;

export const getAppUserProfileRoute = (username: string) =>
  `${routes.appProfile}/${encodeURIComponent(username)}`;

export const legacyAppRoutes = [
  { from: "/radar", to: routes.appRadar },
  { from: "/shortcuts", to: routes.appShortcuts },
  { from: "/tools", to: routes.appTools },
  { from: "/guides", to: routes.appGuides },
  { from: "/community", to: routes.appCommunity },
  { from: "/profile", to: routes.appProfile },
] as const;
