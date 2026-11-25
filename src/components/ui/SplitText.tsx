import { Fragment } from "react";

export interface SplitPart {
  text: string;
  className?: string;
}

/**
 * SplitText (in the spirit of React Bits' SplitText), rendered on the server with zero JS:
 * every word rises out of its own clipping mask on a staggered CSS animation.
 * Styles: `.split .w` / `.split .w > i` in globals.css.
 */
export function SplitText({ parts, delay = 0.12, stagger = 0.055 }: { parts: SplitPart[]; delay?: number; stagger?: number }) {
  let index = 0;
  const words = parts.flatMap((part) =>
    part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, className: part.className, i: index++ })),
  );

  return (
    <>
      {words.map(({ word, className, i }) => (
        <Fragment key={i}>
          <span className="w">
            <i className={className} style={{ animationDelay: `${(delay + i * stagger).toFixed(3)}s` }}>
              {word}
            </i>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
