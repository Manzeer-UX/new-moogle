"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Shared state: which mega menu is open, and whether the drawer is.  */
/* ------------------------------------------------------------------ */

interface NavState {
  openMenu: string | null;
  open: (id: string) => void;
  closeSoon: () => void;
  closeAll: () => void;
  keepOpen: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  burgerRef: React.RefObject<HTMLButtonElement | null>;
}

const NavContext = createContext<NavState | null>(null);

function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("Nav components must be inside <NavProvider>");
  return ctx;
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const keepOpen = useCallback(() => window.clearTimeout(timer.current), []);
  const open = useCallback((id: string) => {
    window.clearTimeout(timer.current);
    setOpenMenu(id);
  }, []);
  const closeSoon = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenMenu(null), 160);
  }, []);
  const closeAll = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpenMenu(null);
  }, []);

  // Escape closes everything; a click outside the header closes the mega menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setDrawerOpen(false);
    };
    const onClick = (e: globalThis.MouseEvent) => {
      if (!(e.target as Element).closest?.(".sx-nav")) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer.current);
    };
  }, []);

  const value = useMemo(
    () => ({ openMenu, open, closeSoon, closeAll, keepOpen, drawerOpen, setDrawerOpen, burgerRef }),
    [openMenu, open, closeSoon, closeAll, keepOpen, drawerOpen],
  );
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Sticky header with "scrolled" state and a reading-progress bar     */
/* ------------------------------------------------------------------ */

export function HeaderBar({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className={scrolled ? "sx-nav sx-scrolled" : "sx-nav"}>
      {children}
      <span className="sx-prog" ref={progress} aria-hidden="true" />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Mega menu item: trigger button + its panel (hover, click, keyboard) */
/* ------------------------------------------------------------------ */

export function MegaItem({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const { openMenu, open, closeSoon, closeAll, keepOpen } = useNav();
  const isOpen = openMenu === id;
  const panelId = `sx-m-${id}`;

  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (isOpen && !e.currentTarget.contains(e.relatedTarget as Node | null)) closeAll();
  };
  const onPanelClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a")) closeAll();
  };
  // Hover intent for real mice only: on touch screens a tap would otherwise open and then
  // immediately close the menu (emulated mouseenter followed by click).
  const isMouse = (e: PointerEvent<HTMLElement>) => e.pointerType === "mouse";

  return (
    <li onBlur={onBlur}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? closeAll() : open(id))}
        onPointerEnter={(e) => isMouse(e) && open(id)}
        onPointerLeave={(e) => isMouse(e) && closeSoon()}
      >
        {label}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={isOpen ? "sx-mega sx-open" : "sx-mega"}
        id={panelId}
        onPointerEnter={(e) => isMouse(e) && keepOpen()}
        onPointerLeave={(e) => isMouse(e) && closeSoon()}
        onClick={onPanelClick}
      >
        {children}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: burger + full-screen drawer                                 */
/* ------------------------------------------------------------------ */

export function BurgerButton() {
  const { setDrawerOpen, drawerOpen, burgerRef } = useNav();
  return (
    <button
      ref={burgerRef}
      className="sx-burger"
      type="button"
      aria-label="Open menu"
      aria-expanded={drawerOpen}
      aria-controls="sx-drawer"
      onClick={() => setDrawerOpen(true)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}

export function Drawer({ logo, children }: { logo: ReactNode; children: ReactNode }) {
  const { drawerOpen, setDrawerOpen, burgerRef } = useNav();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    // While open, everything behind the drawer is inert: focus stays inside (a modal dialog).
    const behind = Array.from(document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer"));
    if (drawerOpen) {
      wasOpen.current = true;
      root.style.overflow = "hidden";
      behind.forEach((el) => (el.inert = true));
      closeBtn.current?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      root.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
      burgerRef.current?.focus();
    }
  }, [drawerOpen, burgerRef]);

  // The drawer only exists below 1080px: close it if the window grows past that.
  useEffect(() => {
    const mq = matchMedia("(min-width: 1081px)");
    const onChange = () => mq.matches && setDrawerOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setDrawerOpen]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a")) setDrawerOpen(false);
  };

  return (
    <div
      className={drawerOpen ? "sx-drawer sx-open" : "sx-drawer"}
      id="sx-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!drawerOpen}
      onClick={onClick}
    >
      <div className="sx-dh">
        {logo}
        <button ref={closeBtn} className="sx-burger" type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
}
