export const canonicalNewRoutes = [
  "/",
  "/studio/useful-websites",
  "/studio/prompt-collection",
  "/studio/skill-workflow",
  "/studio/photography",
  "/studio/agent-guide",
  "/studio/digital-life",
  "/concept-lab",
];

export const retiredSlugs = [
];

export const legacyFramerRoutes = [
];

export const publishedRoutes = [
  ...canonicalNewRoutes,
  ...retiredSlugs,
];

export const canonicalPages = [
  {
    route: "/",
    file: "public/index.html",
    pageId: "new:home",
    title: "FY Digital Life",
  },
  {
    route: "/studio/useful-websites",
    file: "public/studio/useful-websites/index.html",
    pageId: "new:useful-websites",
    title: "FY Digital Life",
  },
  {
    route: "/studio/prompt-collection",
    file: "public/studio/prompt-collection/index.html",
    pageId: "new:prompt-collection",
    title: "FY Digital Life",
  },
  {
    route: "/studio/skill-workflow",
    file: "public/studio/skill-workflow/index.html",
    pageId: "new:skill-workflow",
    title: "FY Digital Life",
  },
  {
    route: "/studio/photography",
    file: "public/studio/photography/index.html",
    pageId: "new:photography-showcase",
    title: "FY Digital Life",
  },
  {
    route: "/studio/agent-guide",
    file: "public/studio/agent-guide/index.html",
    pageId: "new:agent-guide",
    title: "FY Digital Life",
  },
  {
    route: "/studio/digital-life",
    file: "public/studio/digital-life/index.html",
    pageId: "new:digital-life-profile",
    title: "FY Digital Life",
  },
  {
    route: "/concept-lab",
    file: "public/concept-lab/index.html",
    pageId: "new:concept-lab",
    title: "FY Digital Life",
  },
];

export function normalizeRoute(route) {
  const clean = route.replace(/\/+$/, "");
  return clean || "/";
}
