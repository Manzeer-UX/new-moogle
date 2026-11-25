import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { INNER_PAGES } from "@/lib/inner-pages";
import { withBase } from "@/lib/routes";
import { InnerPageScripts } from "./InnerPageScripts";

/** Title and description for an inner page (the root layout appends "| MoogleLabs"). */
export function innerMetadata(slug: string): Metadata {
  const { title, description } = INNER_PAGES[slug];
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

/**
 * An inner page: the original staging markup, read from src/content/pages/<slug>.html at build
 * time and prerendered as static HTML. Internal links in it are root-relative ("/agentic-ai"),
 * so they get the deployment's base path here. The template's styles come from the route
 * group's layout; the few interactive bits are wired up by <InnerPageScripts>.
 */
export function InnerPage({ slug }: { slug: string }) {
  const file = path.join(process.cwd(), "src", "content", "pages", `${slug}.html`);
  const html = readFileSync(file, "utf8").replace(/href="(\/[^"/][^"]*|\/)"/g, (_, href: string) => `href="${withBase(href)}"`);
  return (
    <>
      <div className="pg" dangerouslySetInnerHTML={{ __html: html }} />
      <InnerPageScripts />
    </>
  );
}
