"use client";

import { useEffect } from "react";

const BMC_SRC = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";

export const BUY_ME_A_COFFEE_ID = "mrdevx";

/** Injects the official BMC script. Dispatches `DOMContentLoaded` after load because the widget listens for that event and misses it when the script is added late (App Router / client-only). */
export function BuyMeACoffeeWidget() {
  useEffect(() => {
    if (document.getElementById("bmc-widget-loader")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "bmc-widget-loader";
    script.src = BMC_SRC;
    script.async = true;
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", BUY_ME_A_COFFEE_ID);
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-color", "#FF813F");
    // Left (the widget only matches lowercase "left"): the bottom-right corner belongs to the Ask MR launcher.
    script.setAttribute("data-position", "left");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    script.addEventListener("load", () => {
      window.dispatchEvent(new Event("DOMContentLoaded"));
    });

    document.body.appendChild(script);
  }, []);

  return null;
}
