"use client";

import { useEffect } from "react";

const BMC_SRC = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";

const bmcPositionOriginals = new WeakMap<
  HTMLElement,
  {
    bottom: string;
    left: string;
  }
>();

function syncBmcMobilePosition(): void {
  const btn = document.getElementById("bmc-wbtn");
  if (!btn) {
    return;
  }

  const mobile = window.matchMedia("(max-width: 640px)").matches;

  if (mobile) {
    if (!bmcPositionOriginals.has(btn)) {
      const bottom = btn.style.bottom;
      const left = btn.style.left;
      if (bottom !== "" || left !== "") {
        bmcPositionOriginals.set(btn, {
          bottom,
          left,
        });
      }
    }
    btn.style.setProperty("bottom", "calc(6rem + env(safe-area-inset-bottom, 0px))");
    btn.style.setProperty("left", "1rem");
    return;
  }

  const orig = bmcPositionOriginals.get(btn);
  if (!orig) {
    return;
  }
  if (orig.bottom) {
    btn.style.setProperty("bottom", orig.bottom);
  } else {
    btn.style.removeProperty("bottom");
  }
  if (orig.left) {
    btn.style.setProperty("left", orig.left);
  } else {
    btn.style.removeProperty("left");
  }
}

/** Injects the official BMC script. Dispatches `DOMContentLoaded` after load because the widget listens for that event and misses it when the script is added late (App Router / client-only). */
export function BuyMeACoffeeWidget() {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onMqChange = () => {
      syncBmcMobilePosition();
    };

    const observer = new MutationObserver(() => {
      syncBmcMobilePosition();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    mq.addEventListener("change", onMqChange);

    if (document.getElementById("bmc-widget-loader")) {
      syncBmcMobilePosition();
      return () => {
        observer.disconnect();
        mq.removeEventListener("change", onMqChange);
      };
    }

    const script = document.createElement("script");
    script.id = "bmc-widget-loader";
    script.src = BMC_SRC;
    script.async = true;
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "mrdevx");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-message", "If I saved you a headache, here's where headaches buy coffee.");
    script.setAttribute("data-color", "#FF813F");
    // Left (the widget only matches lowercase "left"): the bottom-right corner belongs to the Ask MR launcher.
    script.setAttribute("data-position", "left");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    script.addEventListener("load", () => {
      window.dispatchEvent(new Event("DOMContentLoaded"));
      requestAnimationFrame(() => {
        syncBmcMobilePosition();
        requestAnimationFrame(syncBmcMobilePosition);
      });
    });

    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", onMqChange);
    };
  }, []);

  return null;
}
