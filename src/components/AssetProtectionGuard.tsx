"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Client-side defense-in-depth for wedding portraits, race karts, and gallery media.
 * Prevents drag-and-drop extraction of `<img>` elements globally and blocks casual
 * right-click saving on public showcase pages (keeps `/admin` and text inputs normal).
 */
export function AssetProtectionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "IMG" ||
          Boolean(target.closest("img, .protected-asset")))
      ) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (pathname?.startsWith("/admin")) return;
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [pathname]);

  return null;
}

