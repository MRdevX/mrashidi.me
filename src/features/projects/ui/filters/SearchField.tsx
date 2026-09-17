"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { styles } from "../shared/styles";

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function SearchField() {
  const { filters, setQuery } = useProjectCatalog();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusOnSlash = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditable(event.target)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusOnSlash);
    return () => window.removeEventListener("keydown", focusOnSlash);
  }, []);

  const clear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex flex-1 items-center">
      <label htmlFor="project-search" className="sr-only">
        Search projects
      </label>
      <Search
        className="pointer-events-none absolute left-4 size-[18px] text-gray-500 dark:text-gray-400"
        aria-hidden
      />
      <input
        ref={inputRef}
        id="project-search"
        type="search"
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && filters.query) {
            event.preventDefault();
            setQuery("");
          }
        }}
        placeholder="Search projects, roles or tech"
        autoComplete="off"
        className={cn(
          styles.field,
          styles.fieldFocus,
          "h-12 w-full pr-12 pl-11 font-albert text-base placeholder:text-gray-500 md:text-[15px] [&::-webkit-search-cancel-button]:hidden"
        )}
      />
      {filters.query ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className={cn(styles.iconButton, "absolute right-1.5 size-9")}
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : (
        <kbd
          aria-hidden
          className="pointer-events-none absolute right-3 hidden rounded border border-gray-300 px-1.5 py-0.5 font-terminal text-xs text-gray-500 md:block dark:border-white/15 dark:text-gray-400"
        >
          /
        </kbd>
      )}
    </div>
  );
}
