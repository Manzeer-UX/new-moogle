# MoogleLabs Enterprise AI: Next.js site

A Next.js 16 (App Router) rebuild of the MoogleLabs site
(`https://stgps.appsndevs.com/BEL/mooglelabs_v1/`), built for speed: the homepage plus all 15 inner
pages (10 solution pages, 5 challenge pages). Every link stays on this site, apart from the
DevForge links in the platforms section (a separate product site).

## Scripts

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build (Vercel, `npm start`, any Node host)
npm start              # serve the production build
npm run build:static   # plain static files in ./out (Apache, IIS, S3, any file host)
npm run lint
npm run typecheck
```

Hosting the static build in a sub-folder (like the current staging site)? Set the base path first:

```powershell
$env:NEXT_BASE_PATH = "/BEL/mooglelabs_next"; npm run build:static
```

## How it is built for speed

| | Original page | This build |
|---|---|---|
| Render-blocking requests | Google Fonts CSS | none: CSS is inlined into the HTML |
| Fonts | Google Fonts, third-party | self-hosted, preloaded, metric-matched fallbacks |
| 3D globe | three.js r128 from a CDN (~603 KB raw, ~150 KB gzip), parser-blocking | custom WebGL renderer, ~12 KB raw, loaded only when the browser is idle |
| Logo | 18 KB inline SVG, repeated 3 times | 6 KB SVG symbol, sent once, reused with `<use>` |
| Page | client-side scripts | prerendered static HTML; React only hydrates the interactive islands |

- Server components by default. Client components only where there is interaction: header and menus,
  challenge picker, lifecycle tabs, PRISM trace counters, spotlight cards, contact form, globe.
- The globe pauses when the hero is off screen or the tab is hidden, honours
  `prefers-reduced-motion`, and is skipped entirely for visitors with Save-Data turned on.
- Animations are CSS transitions and keyframes plus IntersectionObserver. No animation libraries.
- Content is in the server HTML. Scroll-in animations only arm elements that start below the fold,
  so nothing stays hidden if JavaScript fails.

The rest of the initial JavaScript (~140 KB gzip) is the React 19 and Next.js runtime: the fixed
cost of the framework. It loads `async` and doesn't block rendering.

### Measuring

Lighthouse (Chrome DevTools, Lighthouse tab), or from a terminal against a production build:

```bash
npm run build && npm start
npx lighthouse http://localhost:3000 --view
```

For real-world numbers, run PageSpeed Insights on the deployed URL.

## Project structure

```
src/
  app/
    layout.tsx         fonts, metadata, header, footer, scroll reveal
    globals.css        shared styles: tokens, base, header, footer, scroll reveal
    page.tsx           homepage sections
    home.css           homepage section styles (loaded on the homepage only)
    (solutions)/       the 10 solution pages: one folder per page + solution.css (their template)
    (challenges)/      the 5 challenge pages: one folder per page + challenge.css (their template)
    icon.svg           favicon (the logo mark)
  content/
    pages/<slug>.html  the body of each inner page (edit the copy here)
  components/
    layout/            SiteHeader, nav-client (mega menu, drawer), SiteFooter, Logo, ScrollReveal
    home/              one component per homepage section, plus globe.ts (WebGL)
    inner/             InnerPage (renders a page's HTML), InnerPageScripts (tabs, contact form)
    ui/                Icon, SplitText, CountUp, SpotlightGroup, RevealSection, useArmedReveal
  lib/
    content.ts         homepage copy and data (challenges, solutions, lifecycle, ...)
    inner-pages.ts     inner page titles and descriptions
    routes.ts          link helpers (base path, contact anchor, external links)
```

## Inner pages

The 15 inner pages are ported from staging as-is: the same markup and the same template styles,
checked against staging at 1440 px and 375 px (every section has the same height to the pixel).

- **Content:** each page's body is plain HTML in `src/content/pages/<slug>.html`. Edit the copy
  there; link to other pages with root-relative paths (`/agentic-ai`, `/#talk`) and the base path
  is added automatically. Titles and meta descriptions are in `src/lib/inner-pages.ts`.
- **Styles:** each template's stylesheet (`solution.css`, `challenge.css`) is inlined only into
  its own pages, and the homepage styles only into the homepage. Links between pages are plain
  `<a>` links (full page loads), so two templates never share a document.
- **Interactivity:** lifecycle tabs, the handover-kit preview and the contact form are wired up
  by `InnerPageScripts` (about 1 KB). The challenge pages' road diagram, built with JavaScript on
  staging, is pre-rendered into the HTML.
- **Adding a page:** add `src/content/pages/<slug>.html`, an entry in `src/lib/inner-pages.ts`
  and `src/app/(solutions|challenges)/<slug>/page.tsx` (copy any existing one).

## Changes from the original

The layout and design are a 1:1 port, checked section by section at 1440 px: every section below the
hero has the same height to the pixel. Deliberate differences:

- **Quirks mode.** The original HTML has no `<!DOCTYPE>`, so browsers render it in quirks mode. This
  build renders in standards mode, with three small CSS adjustments so spacing stays identical.
- **"Trusted by" marquee.** "Pratham International" no longer wraps onto two lines (the hero strip is
  26 px shorter), and the loop no longer jumps by half a gap.
- **Hero intro.** The paragraph fades in at 0.2 s instead of 0.75 s. It is the largest text in the hero
  (the LCP element), so this lands LCP about half a second sooner. To restore the original timing, set
  the `.hero .lede` / `.hero .ctas` delays in `globals.css` back to `0.75s` / `0.9s`.
- **Hero copy.** Updated to the new messaging: "Enterprise AI Engineering" eyebrow, "From Experimental
  AI to Production Intelligence" headline, new paragraph, and "Discuss Your AI Roadmap" (to the contact
  form) / "Explore Solutions Below" (to the solutions section) buttons.
- **New "Capabilities & Solutions" section** between the hero and "End-to-End Enterprise Delivery": the
  ten solutions in four categories, as a pick-a-category explorer styled after the inner pages: a
  dark offer-style card whose glow takes the selected category's colour, lifecycle-style tabs
  ("Category 1:" … "Category 4:") across the top and release-gate-style glass cards (an accordion at
  900 px and below). Below it, "Industries We Serve" as one framed grid (the title in the first cell,
  the nine industries filling in as it scrolls into view). The hero's "Explore Solutions Below"
  button now scrolls to the section.
- **Client copy is used verbatim.** Sections whose copy came from the client's content doc (hero,
  picker, Capabilities & Solutions, Industries, platforms intro, Why MoogleLabs, the 7 Delivery
  Stages) show exactly that copy, labels included ("Focus:", "Differentiator:"), with no added
  wording. Only the small section labels above headings are set in capitals by the site style.
- **Contact Us** (header, drawer and footer) scrolls to the contact section of the current page
  instead of opening mooglelabs.com in a new tab: every page ends with one.
- **Success Stories, Blog and About removed** (header, drawer and footer), along with the "See all
  success stories" links on the challenge pages: they led off-site to mooglelabs.com and staging
  has no version of these pages. The footer's Company column went with them; its Contact Us link
  now sits under the footer blurb.
- **Inner pages:** page titles get a "| MoogleLabs" suffix; the tabs also work with arrow keys,
  Home and End; dark-mode colours are dropped (light theme only, as on the homepage); one CSS rule
  that browsers ignore anyway (a `var()` inside a selector) is left out because the build rejects it.
- **Broken link fixed.** "See PRISM AI in action" pointed at `ai-security.html` (404); it now goes to
  `ai-security-governance.html#prism`, like the menu's PRISM link.
- **Small additions, in the spirit of React Bits** (written from scratch, no libraries): the PRISM
  trace draws in and its timings count up when scrolled into view (CountUp), and the six "Why
  MoogleLabs" cards get a pointer-following spotlight (SpotlightCard).
- **Accessibility.** Proper heading order, keyboard-operable lifecycle tabs (arrow keys, Home and End),
  a focus-trapped, scroll-locking mobile drawer, keyboard-reachable mega-menu links, a skip link,
  and a fix for touch screens where a tap opened and instantly closed a mega menu.
- **Light theme only.** The original declared dark-mode colours but kept the header, footer and
  picker hard-coded white, which made dark mode unreadable. The client asked for white backgrounds,
  so this build is light-only.

## Before going live

- The contact form only shows a thank-you message, as on the original. Wire `onSubmit` in
  `src/components/home/ContactForm.tsx` to your CRM, an API route or a form service.
- The "Work" section and client names are the original placeholders (`[Client name]`, `[x]%`, ...).
- Impeccable's review checklist would flag a few things kept here for fidelity: grey text
  (`--ink-3`) and orange-on-tint labels below WCAG AA contrast, gradient headline text, the eyebrow
  pill, the pulsing dot and the auto-scrolling marquee.
"# new-moogle" 
