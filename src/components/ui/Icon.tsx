/** Stroke icons used across the site (24x24 grid, drawn with currentColor). */
const PATHS = {
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  rocket: "M5 19c2-6 6-11 14-14-1 7-5 12-11 14zM5 19l4-4",
  database:
    "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  databaseHalf: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  shieldCheck: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
  trend: "M4 19h16M6 15l4-4 3 3 5-6",
  hexagon: "M12 2l9 5v10l-9 5-9-5V7z",
  robot: "M12 8V4M8 4h8M5 8h14v11H5zM9 13h.01M15 13h.01M9 17h6",
  flow: "M5 6h5v4H5zM14 14h5v4h-5zM7.5 10v4a2 2 0 0 0 2 2H14",
  cloud: "M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z",
  flask: "M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3",
  check: "M5 12l5 5L20 7",
  blocks: "M7 7h4v4H7zM13 13h4v4h-4zM11 9h4v2M9 11v4h2",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v4l3 2",
  unlock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.76-1.37M12 15v2",
  // industries
  medical: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  truck: "M2 6h12v9H2zM14 9h4l3 3v3h-7M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  card: "M3 6h18v12H3zM3 10h18M7 15h3",
  gradCap: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6",
  house: "M3 10.5L12 4l9 6.5V20H3zM9.5 20v-6h5v6",
  factory: "M3 21V10l6 4v-4l6 4V4h5v17zM7 17h2M12 17h2",
  umbrella: "M3 12a9 9 0 0 1 18 0zM12 12v6a2 2 0 0 1-4 0",
  hardHat: "M2 18h20M4 18v-2a8 8 0 0 1 16 0v2M10 8.3V6h4v2.3",
  columns: "M3 9l9-5 9 5zM5 9v9M9.5 9v9M14.5 9v9M19 9v9M4 18h16M3 21h18",
  chevron: "M6 9l6 6 6-6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "ico" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
