import { INNER_PAGES } from "./inner-pages";

/**
 * Link helpers.
 *
 * Every page of the original site is now a route of this app: the homepage and the 15 inner
 * pages listed in INNER_PAGES. LEGACY_SITE is only a fallback for a slug that has not been
 * ported (none today), so a missing page never turns into a broken link.
 */
export const LEGACY_SITE = "https://stgps.appsndevs.com/BEL/mooglelabs_v1/";

const PORTED = new Set(Object.keys(INNER_PAGES));

// Read at build time (pages are prerendered); see next.config.ts.
const BASE = process.env.NEXT_BASE_PATH ?? "";
const TRAILING_SLASH = process.env.NEXT_OUTPUT === "export";

/**
 * A root-relative href ("/agentic-ai#how") for a plain <a>: adds the deployment's base path and,
 * for static exports, the trailing slash the exported folders use. (next/link does this itself.)
 */
export function withBase(href: string): string {
  const cut = href.indexOf("#");
  const hash = cut < 0 ? "" : href.slice(cut);
  let path = cut < 0 ? href : href.slice(0, cut);
  path = path === "/" ? BASE || "/" : BASE + path;
  if (TRAILING_SLASH && !path.endsWith("/")) path += "/";
  return path + hash;
}

export function pageHref(slug: string, hash = ""): string {
  return PORTED.has(slug) ? withBase(`/${slug}${hash}`) : `${LEGACY_SITE}${slug}.html${hash}`;
}

/** The contact section: every page (home and inner) ends with section#talk. */
export const CONTACT_HREF = "#talk";

export const EXTERNAL = {
  devforge: "https://devforge.ai",
} as const;

/** Props for links that leave the site. */
export const newTab = { target: "_blank", rel: "noopener" } as const;
